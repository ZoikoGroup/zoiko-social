import { Module } from '@nestjs/common'
import { StoriesController } from './stories.controller'
import { StoriesService } from './stories.service'
import { TrayController } from './tray/tray.controller'
import { TrayService } from './tray/tray.service'
import { ViewsController } from './views/views.controller'
import { ViewsService } from './views/views.service'
import { ReactionsController } from './reactions/reactions.controller'
import { ReactionsService } from './reactions/reactions.service'
import { MentionsController } from './mentions/mentions.controller'
import { MentionsService } from './mentions/mentions.service'
import { SupabaseStorage } from './media/supabase-storage.service'
import { TranscodeService } from './media/transcode.service'
import { RefResolverService } from './refs/ref-resolver.service'
import { FeedPostResolver } from './refs/feed-post.resolver'
import { ProfileResolver } from './refs/profile.resolver'
import { CommunityPostResolver } from './refs/community-post.resolver'
import { AuthModule } from '../auth/auth.module'
import { MusicController } from './music/music.controller'
import { MusicService } from './music/music.service'
import { InternalMusicProvider } from './music/providers/internal.provider'
import { StickerRegistryService } from './stickers/sticker-registry.service'
import { EmojiHandler } from './stickers/handlers/emoji.handler'
import { TextHandler } from './stickers/handlers/text.handler'
import { GifHandler } from './stickers/handlers/gif.handler'
import { MentionHandler } from './stickers/handlers/mention.handler'
import { HashtagHandler } from './stickers/handlers/hashtag.handler'
import { TimeHandler } from './stickers/handlers/time.handler'
import { DateHandler } from './stickers/handlers/date.handler'
import {
  WeatherStubHandler,
  PollStubHandler,
  QuestionStubHandler,
  CountdownStubHandler,
} from './stickers/handlers/future-stubs'
import { HighlightsController } from './highlights/highlights.controller'
import { HighlightsService } from './highlights/highlights.service'
import { ArchiveController } from './archive/archive.controller'
import { ArchiveService } from './archive/archive.service'

@Module({
  imports: [AuthModule],
  controllers: [
    StoriesController,
    TrayController,
    ViewsController,
    ReactionsController,
    MentionsController,
    MusicController,
    HighlightsController,
    ArchiveController,
  ],
  providers: [
    StoriesService,
    TrayService,
    ViewsService,
    ReactionsService,
    MentionsService,
    RefResolverService,
    FeedPostResolver,
    ProfileResolver,
    CommunityPostResolver,
    SupabaseStorage,
    TranscodeService,
    MusicService,
    InternalMusicProvider,
    // Sticker Registry
    StickerRegistryService,
    EmojiHandler,
    TextHandler,
    GifHandler,
    MentionHandler,
    HashtagHandler,
    TimeHandler,
    DateHandler,
    WeatherStubHandler,
    PollStubHandler,
    QuestionStubHandler,
    CountdownStubHandler,
    // Highlights & Archive
    HighlightsService,
    HighlightsController,
    ArchiveService,
    ArchiveController,
  ],
  exports: [StoriesService],
})
export class StoriesModule {}
