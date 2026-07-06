import { Global, Module } from '@nestjs/common'
import { NotificationQueueService } from './notification-queue.service'
import { NotificationWriterService } from './notification-writer.service'
import { ScheduledJobsService } from './scheduled-jobs.service'
import { FeedFanoutService } from './feed-fanout.service'
import { StoryMediaService } from './story-media.service'
import { TranscodeService } from '../stories/media/transcode.service'
import { SupabaseStorage } from '../stories/media/supabase-storage.service'
import { PrismaModule } from '../prisma/prisma.module'
import { RealtimeModule } from '../realtime/realtime.module'
import { ConfigModule } from '../config/config.module'

@Global()
@Module({
  imports: [PrismaModule, RealtimeModule, ConfigModule],
  providers: [
    NotificationQueueService,
    NotificationWriterService,
    ScheduledJobsService,
    FeedFanoutService,
    StoryMediaService,
    // StoryMediaService depends on these; provide them here so the global
    // QueueModule can resolve them (StoriesModule keeps its own instances).
    TranscodeService,
    SupabaseStorage,
  ],
  exports: [NotificationQueueService, FeedFanoutService, StoryMediaService],
})
export class QueueModule {}
