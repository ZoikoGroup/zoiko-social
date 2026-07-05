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
import { PostsService } from './posts.service'
import { CreatePostSchema, UpdatePostSchema, type CreatePostInput, type UpdatePostInput } from './posts.schemas'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'
import { RateLimit } from '../common/decorators/rate-limit.decorator'

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @RateLimit({ limit: 10, windowSeconds: 3600, prefix: 'post.create' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(CreatePostSchema)) body: CreatePostInput,
  ) {
    const post = await this.postsService.createPost(user.id, body)
    return { data: post }
  }

  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  async getPost(
    @Param('id') id: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const post = await this.postsService.getPost(id, user?.id)
    return { data: post }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(UpdatePostSchema)) body: UpdatePostInput,
  ) {
    const post = await this.postsService.updatePost(id, user.id, body)
    return { data: post }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    await this.postsService.deletePost(id, user.id)
    return { data: { success: true } }
  }
}

@Controller('me')
export class MePostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get('saved')
  @UseGuards(JwtAuthGuard)
  async saved(
    @CurrentUser() user: AuthenticatedUser,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.postsService.getSavedPosts(
      user.id,
      cursor ?? null,
      limit ? parseInt(limit, 10) : 12,
    )
    return { data: result }
  }
}
