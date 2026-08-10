import { Module } from '@nestjs/common'
import { PostCommentsController, CommentsController } from './comments.controller'
import { CommentsService } from './comments.service'
import { PostsModule } from '../posts/posts.module'
import { AuthModule } from '../auth/auth.module'
import { PersonalizationModule } from '../personalization/personalization.module'

@Module({
  imports: [PostsModule, AuthModule, PersonalizationModule],
  controllers: [PostCommentsController, CommentsController],
  providers: [CommentsService],
})
export class CommentsModule {}
