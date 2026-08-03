import { Module } from '@nestjs/common'
import { HashtagsController } from './hashtags.controller'
import { HashtagsService } from './hashtags.service'
import { PostsModule } from '../posts/posts.module'
import { AuthModule } from '../auth/auth.module'
import { PersonalizationModule } from '../personalization/personalization.module'
import { AdoptionModule } from '../adoption/adoption.module'
import { EventsModule } from '../events/events.module'
import { LostFoundModule } from '../lost-found/lost-found.module'
import { ShopModule } from '../shop/shop.module'
import { CommunitiesModule } from '../communities/communities.module'

@Module({
  imports: [
    PostsModule, AuthModule, PersonalizationModule,
    // A tag page spans every entity that can carry tags.
    AdoptionModule, EventsModule, LostFoundModule, ShopModule, CommunitiesModule,
  ],
  controllers: [HashtagsController],
  providers: [HashtagsService],
  exports: [HashtagsService],
})
export class HashtagsModule {}
