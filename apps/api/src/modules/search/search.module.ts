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

@Module({
  imports: [AuthModule, NetworkModule, HashtagsModule, PostsModule, CommunitiesModule, NewsModule, ShopModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
