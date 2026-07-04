import { Global, Module } from '@nestjs/common'
import { NotificationQueueService } from './notification-queue.service'
import { NotificationWriterService } from './notification-writer.service'
import { ScheduledJobsService } from './scheduled-jobs.service'
import { PrismaModule } from '../prisma/prisma.module'
import { RealtimeModule } from '../realtime/realtime.module'

@Global()
@Module({
  imports: [PrismaModule, RealtimeModule],
  providers: [NotificationQueueService, NotificationWriterService, ScheduledJobsService],
  exports: [NotificationQueueService],
})
export class QueueModule {}
