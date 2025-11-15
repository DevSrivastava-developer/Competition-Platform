import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompetitionDto } from './dto/create-competition.dto';

@Injectable()
export class CompetitionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createCompetitionDto: CreateCompetitionDto) {
    return this.prisma.competition.create({
      data: {
        title: createCompetitionDto.title,
        description: createCompetitionDto.description,
        tags: createCompetitionDto.tags || [],
        capacity: createCompetitionDto.capacity,
        regDeadline: new Date(createCompetitionDto.regDeadline),
        startDate: createCompetitionDto.startDate ? new Date(createCompetitionDto.startDate) : null,
        organizerId: userId,
      },
    });
  }

  async findAll() {
    return this.prisma.competition.findMany({
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        _count: { select: { registrations: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const competition = await this.prisma.competition.findUnique({
      where: { id },
      include: {
        organizer: { select: { id: true, name: true, email: true } },
        _count: { select: { registrations: true } },
      },
    });
    if (!competition) {
      throw new NotFoundException('Competition not found');
    }
    return competition;
  }
}
