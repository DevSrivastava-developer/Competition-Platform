import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  constructor(
    @InjectQueue('registration') private registrationQueue: Queue,
    @InjectQueue('reminder') private reminderQueue: Queue,
  ) {}

  async addRegistrationConfirmation(data: {
    registrationId: string;
    userId: string;
    competitionId: string;
  }) {
    await this.registrationQueue.add('confirmation', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
  }

  async addReminderNotification(data: {
    competitionId: string;
    userId: string;
    competitionTitle: string;
  }) {
    await this.reminderQueue.add('notify', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    });
  }
}
