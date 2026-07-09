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
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'

const TIERS = new Set(['institutional', 'verified', 'community'])

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

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
