import { Global, Module } from '@nestjs/common'
import { NotificationQueueService } from './notification-queue.service'
import { PushModule } from '../push/push.module'
import { NotificationWriterService } from './notification-writer.service'
import { ScheduledJobsService } from './scheduled-jobs.service'
import { NewsModule } from '../news/news.module'
import { FeedFanoutService } from './feed-fanout.service'
import { PrismaModule } from '../prisma/prisma.module'
import { RealtimeModule } from '../realtime/realtime.module'
import { ConfigModule } from '../config/config.module'
import { ProfileModule } from '../profile/profile.module'
import { CommsModule } from '../comms/comms.module'

@Global()
@Module({
  // ProfileModule for the nightly account purge. No cycle: ProfileModule only
  // imports AuthModule, and this module is @Global so nothing imports it back.
  // CommsModule for notification preferences; it imports only Config, Prisma
  // and Database, so it cannot reach back here either.
  imports: [PrismaModule, RealtimeModule, ConfigModule, ProfileModule, CommsModule, PushModule, NewsModule],
  providers: [
    NotificationQueueService,
    NotificationWriterService,
    ScheduledJobsService,
    FeedFanoutService,
  ],
  exports: [NotificationQueueService, FeedFanoutService],
})
export class QueueModule {}
