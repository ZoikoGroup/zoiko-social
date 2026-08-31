import {
  Controller, Get, Post, Patch, Delete, Param, Body, Query, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common'
import { NewsService } from './news.service'
import {
  CreateArticleSchema, UpdateArticleSchema, CommentSchema, NEWS_CATEGORIES,
  type CreateArticleInput, type UpdateArticleInput, type CommentInput, type NewsCategory,
} from './news.schemas'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { RolesGuard } from '../auth/guards/roles.guard'
import { Roles } from '../auth/decorators/roles.decorator'
import { NewsIngestService } from './news-ingest.service'
import { NewsSourceService } from './news-source.service'
import {
  CreateNewsSourceSchema, UpdateNewsSourceSchema,
  type CreateNewsSourceInput, type UpdateNewsSourceInput,
} from './news-source.schemas'
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'

const TIERS = new Set(['institutional', 'verified', 'community'])

@Controller('news')
export class NewsController {
  constructor(
    private readonly newsService: NewsService,
    private readonly ingest: NewsIngestService,
    private readonly sources: NewsSourceService,
  ) {}

  // ── Curation and moderation ───────────────────────────────────────────────
  //
  // Declared before the parameterised routes below, so 'sources' and 'pending'
  // are never swallowed by `:id`.

  /** The curated publisher list. Staff only — this is the trust boundary. */
  @Get('sources')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin', 'super_admin')
  async listSources() {
    return { data: await this.sources.list() }
  }

  @Post('sources')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.CREATED)
  async createSource(@Body(new ZodValidationPipe(CreateNewsSourceSchema)) body: CreateNewsSourceInput) {
    return { data: await this.sources.create(body) }
  }

  @Patch('sources/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  async updateSource(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateNewsSourceSchema)) body: UpdateNewsSourceInput,
  ) {
    return { data: await this.sources.update(id, body) }
  }

  /**
   * Switches a source off immediately.
   *
   * Separate from the general update so it is one call with no body — a
   * hijacked feed publishing into everyone's home feed is the case this exists
   * for, and it should be reachable in one action.
   */
  @Post('sources/:id/disable')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async disableSource(@Param('id') id: string) {
    return { data: await this.sources.setEnabled(id, false) }
  }

  @Delete('sources/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async deleteSource(@Param('id') id: string) {
    await this.sources.remove(id)
    return { data: { success: true } }
  }

  /**
   * Pulls every enabled feed.
   *
   * Callable by staff today, and by the scheduled job once Redis is back. Kept
   * as an endpoint rather than only a job so ingestion can be triggered and
   * observed by hand — a feed that stops working is otherwise silent.
   */
  @Post('ingest')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async runIngest() {
    return { data: await this.ingest.ingestAll() }
  }

  @Post('sources/:id/ingest')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async runIngestOne(@Param('id') id: string) {
    return { data: await this.ingest.ingestSource(id) }
  }

  /** Community submissions waiting on a decision. */
  @Get('pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin', 'super_admin')
  async pending(@Query('limit') limit?: string) {
    const [data, count] = await Promise.all([
      this.newsService.pendingQueue(limit ? Number(limit) : 30),
      this.newsService.pendingCount(),
    ])
    return { data, count }
  }

  @Post('pending/:id/review')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('moderator', 'admin', 'super_admin')
  @HttpCode(HttpStatus.OK)
  async review(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Query('approve') approve?: string,
  ) {
    return { data: await this.newsService.review(id, user.id, approve !== 'false') }
  }

  @Get()
  @UseGuards(OptionalAuthGuard)
  async browse(
    @Query('category') category?: string,
    @Query('tier') tier?: string,
    @Query('q') q?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const filters = {
      ...(category && (NEWS_CATEGORIES as readonly string[]).includes(category) ? { category: category as NewsCategory } : {}),
      ...(tier && TIERS.has(tier) ? { tier } : {}),
      ...(q && q.trim() ? { q: q.trim() } : {}),
    }
    return { data: await this.newsService.browse(filters, user?.id, cursor ?? null, limit ? parseInt(limit, 10) : 15) }
  }

  @Get('featured')
  @UseGuards(OptionalAuthGuard)
  async featured(@Query('limit') limit?: string, @CurrentUser() user?: AuthenticatedUser) {
    return { data: await this.newsService.featured(user?.id, limit ? parseInt(limit, 10) : 3) }
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  async mine(@CurrentUser() user: AuthenticatedUser) {
    return { data: await this.newsService.listMine(user.id) }
  }

  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  async get(@Param('id') id: string, @CurrentUser() user?: AuthenticatedUser) {
    return { data: await this.newsService.get(id, user?.id) }
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@CurrentUser() user: AuthenticatedUser, @Body(new ZodValidationPipe(CreateArticleSchema)) body: CreateArticleInput) {
    return { data: await this.newsService.create(user.id, body) }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body(new ZodValidationPipe(UpdateArticleSchema)) body: UpdateArticleInput) {
    return { data: await this.newsService.update(id, user.id, body) }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async remove(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    await this.newsService.remove(id, user.id)
    return { data: { success: true } }
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  async like(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return { data: await this.newsService.setLike(id, user.id, true) }
  }

  @Delete(':id/like')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async unlike(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return { data: await this.newsService.setLike(id, user.id, false) }
  }

  @Post(':id/save')
  @UseGuards(JwtAuthGuard)
  async save(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return { data: await this.newsService.setSave(id, user.id, true) }
  }

  @Delete(':id/save')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async unsave(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return { data: await this.newsService.setSave(id, user.id, false) }
  }

  @Get(':id/comments')
  async comments(@Param('id') id: string, @Query('cursor') cursor?: string, @Query('limit') limit?: string) {
    return { data: await this.newsService.listComments(id, cursor ?? null, limit ? parseInt(limit, 10) : 20) }
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  async addComment(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Body(new ZodValidationPipe(CommentSchema)) body: CommentInput) {
    return { data: await this.newsService.addComment(id, user.id, body) }
  }

  @Delete(':id/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteComment(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string, @Param('commentId') commentId: string) {
    await this.newsService.deleteComment(id, commentId, user.id)
    return { data: { success: true } }
  }
}
