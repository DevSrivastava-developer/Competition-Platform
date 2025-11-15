import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Processor('registration')
export class RegistrationProcessor extends WorkerHost {
  private readonly logger = new Logger(RegistrationProcessor.name);

  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing registration confirmation job ${job.id}`);

    if (job.name === 'confirmation') {
      return this.handleConfirmation(job.data);
    }

    throw new Error(`Unknown job type: ${job.name}`);
  }

  private async handleConfirmation(data: {
    registrationId: string;
    userId: string;
    competitionId: string;
  }) {
    this.logger.log(`Sending confirmation for registration ${data.registrationId}`);

    const registration = await this.prisma.registration.findUnique({
      where: { id: data.registrationId },
      include: {
        user: true,
        competition: true,
      },
    });

    if (!registration) {
      throw new Error('Registration not found');
    }

    // Simulate email by adding entry in Mailbox table
    await this.prisma.mailbox.create({
      data: {
        to: registration.user.email,
        subject: `Registration Confirmed: ${registration.competition.title}`,
        body: `Hello ${registration.user.name}, your registration for ${registration.competition.title} has been confirmed!`,
        metadata: {
          registrationId: data.registrationId,
          competitionId: data.competitionId,
          type: 'confirmation',
        },
      },
    });

    // Update status to CONFIRMED
    await this.prisma.registration.update({
      where: { id: data.registrationId },
      data: { status: 'CONFIRMED' },
    });

    this.logger.log(`Confirmation email simulated for registration ${data.registrationId}`);

    return { success: true };
  }
}
