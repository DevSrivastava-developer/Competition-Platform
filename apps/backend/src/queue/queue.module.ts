import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { QueueService } from './queue.service';
import { RegistrationProcessor } from './processors/registration.processor';
import { ReminderProcessor } from './processors/reminder.processor';

@Module({
  imports: [
    BullModule.registerQueue(
      { name: 'registration' },
      { name: 'reminder' }
    ),
  ],
  providers: [QueueService, RegistrationProcessor, ReminderProcessor],
  exports: [QueueService],
})
export class QueueModule {}
