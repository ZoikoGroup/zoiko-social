import { Module } from '@nestjs/common'
import { NewsController } from './news.controller'
import { NewsService } from './news.service'
import { NewsIngestService } from './news-ingest.service'
import { NewsCoverService } from './news-cover.service'
import { NewsSourceService } from './news-source.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [NewsController],
  providers: [NewsService, NewsIngestService, NewsSourceService, NewsCoverService],
  exports: [NewsService, NewsIngestService],
})
export class NewsModule {}
