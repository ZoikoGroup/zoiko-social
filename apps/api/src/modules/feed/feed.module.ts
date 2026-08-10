import { Module } from '@nestjs/common'
import { FeedController, ProfilePostsController, CommunityPostsController } from './feed.controller'
import { FeedService } from './feed.service'
import { PostsModule } from '../posts/posts.module'
import { AuthModule } from '../auth/auth.module'
import { PersonalizationModule } from '../personalization/personalization.module'

@Module({
  imports: [PostsModule, AuthModule, PersonalizationModule],
  controllers: [FeedController, ProfilePostsController, CommunityPostsController],
  providers: [FeedService],
})
export class FeedModule {}
