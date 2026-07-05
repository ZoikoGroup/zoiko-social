import { Module } from '@nestjs/common'
import { PostsController, MePostsController } from './posts.controller'
import { PostsService } from './posts.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [PostsController, MePostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
