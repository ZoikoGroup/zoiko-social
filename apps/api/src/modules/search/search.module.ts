import { Module } from '@nestjs/common'
import { SearchController } from './search.controller'
import { SearchService } from './search.service'
import { AuthModule } from '../auth/auth.module'
import { NetworkModule } from '../network/network.module'
import { HashtagsModule } from '../hashtags/hashtags.module'
import { PostsModule } from '../posts/posts.module'
import { CommunitiesModule } from '../communities/communities.module'
import { NewsModule } from '../news/news.module'
import { ShopModule } from '../shop/shop.module'
import { EventsModule } from '../events/events.module'
import { AdoptionModule } from '../adoption/adoption.module'
import { LostFoundModule } from '../lost-found/lost-found.module'
import { ProvidersModule } from '../providers/providers.module'

@Module({
  imports: [
    AuthModule, NetworkModule, HashtagsModule, PostsModule, CommunitiesModule, NewsModule, ShopModule,
    EventsModule, AdoptionModule, LostFoundModule, ProvidersModule,
  ],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
