import { Global, Module } from '@nestjs/common'
import { NotificationQueueService } from './notification-queue.service'
import { NotificationWriterService } from './notification-writer.service'
import { ScheduledJobsService } from './scheduled-jobs.service'
import { FeedFanoutService } from './feed-fanout.service'
import { StoryMediaService } from './story-media.service'
import { TranscodeService } from '../stories/media/transcode.service'
import { SupabaseStorage } from '../stories/media/supabase-storage.service'
import { R2Storage } from '../stories/media/r2-storage.service'
import { MEDIA_STORAGE } from '../stories/media/media-storage.interface'
import { PrismaModule } from '../prisma/prisma.module'
import { RealtimeModule } from '../realtime/realtime.module'
import { ConfigModule } from '../config/config.module'
import { ConfigService } from '../config/config.service'

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
    // Active media storage: Cloudflare R2 when configured, else Supabase Storage.
    // Injected everywhere via the MEDIA_STORAGE token.
    {
      provide: MEDIA_STORAGE,
      useFactory: (config: ConfigService) =>
        config.r2Enabled ? new R2Storage(config) : new SupabaseStorage(config),
      inject: [ConfigService],
    },
  ],
  exports: [NotificationQueueService, FeedFanoutService, StoryMediaService, MEDIA_STORAGE],
})
export class QueueModule {}
