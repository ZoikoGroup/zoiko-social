import { Module } from '@nestjs/common'
import { HashtagsController } from './hashtags.controller'
import { HashtagsService } from './hashtags.service'
import { PostsModule } from '../posts/posts.module'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [PostsModule, AuthModule],
  controllers: [HashtagsController],
  providers: [HashtagsService],
})
export class HashtagsModule {}
