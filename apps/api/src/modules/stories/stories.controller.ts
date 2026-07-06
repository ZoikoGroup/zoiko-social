import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { StoriesService } from './stories.service'
import {
  CreateStorySchema,
  UploadUrlQuerySchema,
  type CreateStoryInput,
  type UploadUrlQuery,
} from './stories.schemas'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'
import { RateLimit } from '../common/decorators/rate-limit.decorator'

@Controller('stories')
export class StoriesController {
  constructor(private readonly storiesService: StoriesService) {}

  /**
   * Get a pre-signed upload URL for direct client-to-storage upload.
   * The client then PUTs the raw media bytes to the returned URL.
   */
  @Get('upload-url')
  @UseGuards(JwtAuthGuard)
  @RateLimit({ limit: 60, windowSeconds: 3600, prefix: 'story.upload-url' })
  async getUploadUrl(
    @CurrentUser() user: AuthenticatedUser,
    @Query(new ZodValidationPipe(UploadUrlQuerySchema)) query: UploadUrlQuery,
  ) {
    const result = await this.storiesService.getUploadUrl(user.id, query)
    return { data: result }
  }

  /**
   * Create a story. For photo/video types the story publishes as
   * `status=processing` and transitions to `ready` after the media
   * worker completes. Text stories are immediately `ready`.
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  @RateLimit({ limit: 30, windowSeconds: 3600, prefix: 'story.create' })
  @HttpCode(HttpStatus.CREATED)
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(CreateStorySchema)) body: CreateStoryInput,
  ) {
    const result = await this.storiesService.createStory(user.id, body)
    return { data: result }
  }

  /**
   * Get a single story by ID. Returns 404 if the story is not found,
   * expired, or the viewer doesn't have permission (never 403).
   */
  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  async getStory(
    @Param('id') id: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const story = await this.storiesService.getStory(id, user?.id)
    return { data: story }
  }

  /**
   * Soft-delete a story. Only the author may delete.
   */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async delete(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    await this.storiesService.deleteStory(id, user.id)
    return { data: { success: true } }
  }

  /**
   * GET /stories/ref/:refType/:refId
   * Resolve a share-to-story reference. Used by the composer to preview
   * the reference card before publishing.
   */
  @Get('ref/:refType/:refId')
  @UseGuards(OptionalAuthGuard)
  async resolveRef(
    @Param('refType') refType: string,
    @Param('refId') refId: string,
    @CurrentUser() user?: AuthenticatedUser,
  ) {
    const result = await this.storiesService.resolveRef(refType, refId, user?.id)
    return { data: result }
  }
}
