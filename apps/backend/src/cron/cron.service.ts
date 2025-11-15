import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { QueueService } from '../queue/queue.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private prisma: PrismaService,
    private queueService: QueueService,
  ) {}

  
  @Cron(process.env.NODE_ENV === 'production' ? CronExpression.EVERY_DAY_AT_MIDNIGHT : CronExpression.EVERY_MINUTE)
  async handleReminderNotifications() {
    this.logger.log('Running reminder notification cron job');

    const now = new Date();
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const upcomingCompetitions = await this.prisma.competition.findMany({
      where: {
        startDate: {
          gte: now,
          lte: tomorrow,
        },
      },
      include: {
        registrations: {
          where: { status: 'CONFIRMED' },
          include: { user: true },
        },
      },
    });

    this.logger.log(`Found ${upcomingCompetitions.length} competitions starting soon`);

    for (const competition of upcomingCompetitions) {
      for (const registration of competition.registrations) {
        await this.queueService.addReminderNotification({
          competitionId: competition.id,
          userId: registration.userId,
          competitionTitle: competition.title,
        });

        this.logger.log(`Reminder enqueued for user ${registration.user.email} in competition ${competition.title}`);
      }
    }

    this.logger.log('Reminder notification cron job completed');
  }

  @Cron('0 2 * * *')
  async purgeOldRegistrations() {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    this.logger.log('Running purge old registrations cron job');

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const deleted = await this.prisma.registration.deleteMany({
      where: {
        createdAt: { lt: thirtyDaysAgo },
        competition: { startDate: { lt: thirtyDaysAgo } },
      },
    });

    this.logger.log(`Purged ${deleted.count} old registrations`);
  }
}
