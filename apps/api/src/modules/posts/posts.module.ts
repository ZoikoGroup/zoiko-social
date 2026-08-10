import { Module } from '@nestjs/common'
import { PostsService } from './posts.service'
import { PostsController, MePostsController } from './posts.controller'
import { AuthModule } from '../auth/auth.module'
import { PersonalizationModule } from '../personalization/personalization.module'

@Module({
  imports: [AuthModule, PersonalizationModule],
  controllers: [PostsController, MePostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {}
