import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from './modules/config/config.module'
import { DatabaseModule } from './modules/database/database.module'
import { CommonModule } from './modules/common/common.module'
import { AuthModule } from './modules/auth/auth.module'
import { PrismaModule } from './modules/prisma/prisma.module'
import { RedisModule } from './modules/redis/redis.module'
import { RealtimeModule } from './modules/realtime/realtime.module'
import { QueueModule } from './modules/queue/queue.module'
import { ProfileModule } from './modules/profile/profile.module'
import { NetworkModule } from './modules/network/network.module'
import { NotificationsModule } from './modules/notifications/notifications.module'
import { PostsModule } from './modules/posts/posts.module'
import { FeedModule } from './modules/feed/feed.module'
import { EngagementModule } from './modules/engagement/engagement.module'
import { CommentsModule } from './modules/comments/comments.module'
import { HashtagsModule } from './modules/hashtags/hashtags.module'
import { CommunitiesModule } from './modules/communities/communities.module'
import { StoriesModule } from './modules/stories/stories.module'
import { PetsModule } from './modules/pets/pets.module'
import { EventsModule } from './modules/events/events.module'
import { AdoptionModule } from './modules/adoption/adoption.module'
import { ProvidersModule } from './modules/providers/providers.module'
import { LostFoundModule } from './modules/lost-found/lost-found.module'
import { NewsModule } from './modules/news/news.module'
import { ShopModule } from './modules/shop/shop.module'
import { BreedingModule } from './modules/breeding/breeding.module'
import { HealthModule } from './health/health.module'
import { MessagingModule } from './modules/messaging/messaging.module'
import { LivekitModule } from './modules/livekit/livekit.module'
import { R2Module } from './modules/storage/r2.module'

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    PrismaModule,
    RedisModule,
    RealtimeModule,
    QueueModule,
    CommonModule,
    AuthModule,
    ProfileModule,
    NetworkModule,
    NotificationsModule,
    PostsModule,
    FeedModule,
    EngagementModule,
    CommentsModule,
    HashtagsModule,
    CommunitiesModule,
    StoriesModule,
    PetsModule,
    EventsModule,
    AdoptionModule,
    ProvidersModule,
    LostFoundModule,
    NewsModule,
    ShopModule,
    BreedingModule,
    HealthModule,
    MessagingModule,
    LivekitModule,
    R2Module,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
