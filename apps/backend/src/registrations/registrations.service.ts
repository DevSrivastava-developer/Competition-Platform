import {
  Injectable,
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class RegistrationsService {
  constructor(
    private prisma: PrismaService,
    private queueService: QueueService,
  ) {}

  async register(
    userId: string,
    competitionId: string,
    idempotencyKey?: string,
  ) {
    // Idempotency check
    if (idempotencyKey) {
      const existing = await this.prisma.registration.findUnique({
        where: { idempotencyKey },
      });
      if (existing) {
        return {
          registrationId: existing.id,
          message: 'Registration already exists (idempotent)',
        };
      }
    }

    // Fetch competition
    const competition = await this.prisma.competition.findUnique({
      where: { id: competitionId },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!competition) {
      throw new NotFoundException('Competition not found');
    }

    if (new Date() > new Date(competition.regDeadline)) {
      throw new BadRequestException('Registration deadline has passed');
    }

    // Transaction to check capacity, prevent overselling
    const registration = await this.prisma.$transaction(async (tx) => {
      // Lock competition row
      const lockedComp = await tx.$queryRaw<
        Array<{ id: string; capacity: number; registration_count: string }>
      >`
        SELECT id, capacity, 
         (SELECT COUNT(*) FROM registrations WHERE "competitionId" = ${competitionId}) as registration_count
        FROM competitions
        WHERE id = ${competitionId}
        FOR UPDATE
      `;

      if (lockedComp.length === 0) {
        throw new NotFoundException('Competition not found (locked)');
      }

      const current = parseInt(lockedComp[0].registration_count, 10);
      const capacity = lockedComp[0].capacity;

      if (current >= capacity) {
        throw new BadRequestException('Competition is full');
      }

      // Check user already registered
      const exists = await tx.registration.findUnique({
        where: {
          competitionId_userId: {
            competitionId,
            userId,
          },
        },
      });

      if (exists) {
        throw new ConflictException('Already registered for this competition');
      }

      // Create registration
      return await tx.registration.create({
        data: {
          competitionId,
          userId,
          idempotencyKey,
          status: 'PENDING',
        },
      });
    });

    // Enqueue confirmation email job
    await this.queueService.addRegistrationConfirmation({
      registrationId: registration.id,
      userId,
      competitionId,
    });

    return {
      registrationId: registration.id,
      message: 'Registration successful',
    };
  }
}
