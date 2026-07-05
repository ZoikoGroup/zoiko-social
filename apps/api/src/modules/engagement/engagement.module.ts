import { Module } from '@nestjs/common'
import { EngagementController } from './engagement.controller'
import { EngagementService } from './engagement.service'
import { PostsModule } from '../posts/posts.module'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [PostsModule, AuthModule],
  controllers: [EngagementController],
  providers: [EngagementService],
})
export class EngagementModule {}
