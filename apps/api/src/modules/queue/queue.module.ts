import { Global, Module } from '@nestjs/common'
import { NotificationQueueService } from './notification-queue.service'
import { NotificationWriterService } from './notification-writer.service'
import { ScheduledJobsService } from './scheduled-jobs.service'
import { FeedFanoutService } from './feed-fanout.service'
import { PrismaModule } from '../prisma/prisma.module'
import { RealtimeModule } from '../realtime/realtime.module'
import { ConfigModule } from '../config/config.module'

@Global()
@Module({
  imports: [PrismaModule, RealtimeModule, ConfigModule],
  providers: [NotificationQueueService, NotificationWriterService, ScheduledJobsService, FeedFanoutService],
  exports: [NotificationQueueService, FeedFanoutService],
})
export class QueueModule {}
