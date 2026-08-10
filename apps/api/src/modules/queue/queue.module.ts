import { Global, Module } from '@nestjs/common'
import { NotificationQueueService } from './notification-queue.service'
import { NotificationWriterService } from './notification-writer.service'
import { ScheduledJobsService } from './scheduled-jobs.service'
import { FeedFanoutService } from './feed-fanout.service'
import { PrismaModule } from '../prisma/prisma.module'
import { RealtimeModule } from '../realtime/realtime.module'
import { ConfigModule } from '../config/config.module'
import { ProfileModule } from '../profile/profile.module'

@Global()
@Module({
  // ProfileModule for the nightly account purge. No cycle: ProfileModule only
  // imports AuthModule, and this module is @Global so nothing imports it back.
  imports: [PrismaModule, RealtimeModule, ConfigModule, ProfileModule],
  providers: [
    NotificationQueueService,
    NotificationWriterService,
    ScheduledJobsService,
    FeedFanoutService,
  ],
  exports: [NotificationQueueService, FeedFanoutService],
})
export class QueueModule {}
