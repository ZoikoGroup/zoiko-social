import { Module } from '@nestjs/common'
import { EngagementController } from './engagement.controller'
import { EngagementService } from './engagement.service'
import { PostsModule } from '../posts/posts.module'
import { AuthModule } from '../auth/auth.module'
import { MessagingModule } from '../messaging/messaging.module'

@Module({
  imports: [PostsModule, AuthModule, MessagingModule],
  controllers: [EngagementController],
  providers: [EngagementService],
})
export class EngagementModule {}
