import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { CommentsService } from './comments.service'
import {
  CreateCommentSchema,
  UpdateCommentSchema,
  type CreateCommentInput,
  type UpdateCommentInput,
} from '../posts/posts.schemas'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'
import { RateLimit } from '../common/decorators/rate-limit.decorator'

@Controller('posts/:postId/comments')
export class PostCommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @RateLimit({ limit: 30, windowSeconds: 60, prefix: 'comment.create' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Param('postId') postId: string,
    @Body(new ZodValidationPipe(CreateCommentSchema)) body: CreateCommentInput,
  ) {
    const comment = await this.commentsService.create(user.id, postId, body.body, body.parentId)
    return { data: comment }
  }

  @Get()
  @UseGuards(OptionalAuthGuard)
  async list(
    @Param('postId') postId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const result = await this.commentsService.listThread(
      postId,
      user?.id,
      cursor ?? null,
      limit ? parseInt(limit, 10) : 20,
    )
    return { data: result }
  }

  @Post(':commentId/pin')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async pin(
    @CurrentUser() user: AuthenticatedUser,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ) {
    await this.commentsService.setPinned(postId, commentId, user.id, true)
    return { data: { pinned: true } }
  }

  @Delete(':commentId/pin')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async unpin(
    @CurrentUser() user: AuthenticatedUser,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
  ) {
    await this.commentsService.setPinned(postId, commentId, user.id, false)
    return { data: { pinned: false } }
  }
}

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':id/replies')
  @UseGuards(OptionalAuthGuard)
  async replies(
    @Param('id') id: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const result = await this.commentsService.listReplies(
      id,
      user?.id,
      cursor ?? null,
      limit ? parseInt(limit, 10) : 10,
    )
    return { data: result }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async edit(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdateCommentSchema)) body: UpdateCommentInput,
  ) {
    const comment = await this.commentsService.edit(id, user.id, body.body)
    return { data: comment }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    await this.commentsService.delete(id, user.id)
    return { data: { success: true } }
  }

  @Post(':id/like')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async like(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    const result = await this.commentsService.likeComment(user.id, id)
    return { data: result }
  }

  @Delete(':id/like')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async unlike(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    const result = await this.commentsService.unlikeComment(user.id, id)
    return { data: result }
  }
}
