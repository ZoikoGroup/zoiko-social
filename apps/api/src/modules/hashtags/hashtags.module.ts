import { Module } from '@nestjs/common'
import { HashtagsController } from './hashtags.controller'
import { HashtagsService } from './hashtags.service'
import { PostsModule } from '../posts/posts.module'
import { AuthModule } from '../auth/auth.module'
import { PersonalizationModule } from '../personalization/personalization.module'

@Module({
  imports: [PostsModule, AuthModule, PersonalizationModule],
  controllers: [HashtagsController],
  providers: [HashtagsService],
  exports: [HashtagsService],
})
export class HashtagsModule {}
