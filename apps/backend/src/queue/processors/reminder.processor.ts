import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Processor('reminder')
export class ReminderProcessor extends WorkerHost {
  private readonly logger = new Logger(ReminderProcessor.name);

  constructor(private prisma: PrismaService) {
    super();
  }

  async process(job: Job<any>): Promise<any> {
    this.logger.log(`Processing reminder job ${job.id}`);

    if (job.name === 'notify') {
      return this.handleNotify(job.data);
    }

    throw new Error(`Unknown job name: ${job.name}`);
  }

  private async handleNotify(data: {
    competitionId: string;
    userId: string;
    competitionTitle: string;
  }) {
    this.logger.log(`Sending reminder for competition ${data.competitionId} to user ${data.userId}`);

    const user = await this.prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Simulate email by adding to Mailbox
    await this.prisma.mailbox.create({
      data: {
        to: user.email,
        subject: `Reminder: ${data.competitionTitle} starts soon!`,
        body: `Hello ${user.name}, this is a reminder that ${data.competitionTitle} is starting within 24 hours. Don't forget to participate!`,
        metadata: {
          competitionId: data.competitionId,
          userId: data.userId,
          type: 'reminder',
        },
      },
    });

    this.logger.log(`Reminder email simulated to user ${user.email}`);

    return { success: true };
  }
}
