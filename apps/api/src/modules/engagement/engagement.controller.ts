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
import { EngagementService } from './engagement.service'
import { ShareSchema, type ShareInput } from '../posts/posts.schemas'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'

@Controller('posts')
@UseGuards(JwtAuthGuard)
export class EngagementController {
  constructor(private readonly engagementService: EngagementService) {}

  @Post(':id/like')
  @HttpCode(HttpStatus.OK)
  async like(@CurrentUser() user: AuthenticatedUser, @Param('id') postId: string) {
    const result = await this.engagementService.like(user.id, postId)
    return { data: result }
  }

  @Delete(':id/like')
  @HttpCode(HttpStatus.OK)
  async unlike(@CurrentUser() user: AuthenticatedUser, @Param('id') postId: string) {
    const result = await this.engagementService.unlike(user.id, postId)
    return { data: result }
  }

  @Get(':id/likes')
  async likers(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') postId: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.engagementService.getLikers(
      postId,
      user.id,
      cursor ?? null,
      limit ? parseInt(limit, 10) : 20,
    )
    return { data: result }
  }

  @Post(':id/save')
  @HttpCode(HttpStatus.OK)
  async save(@CurrentUser() user: AuthenticatedUser, @Param('id') postId: string) {
    const result = await this.engagementService.save(user.id, postId)
    return { data: result }
  }

  @Delete(':id/save')
  @HttpCode(HttpStatus.OK)
  async unsave(@CurrentUser() user: AuthenticatedUser, @Param('id') postId: string) {
    const result = await this.engagementService.unsave(user.id, postId)
    return { data: result }
  }

  @Post(':id/share')
  @HttpCode(HttpStatus.OK)
  async share(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') postId: string,
    @Body(new ZodValidationPipe(ShareSchema)) body: ShareInput,
  ) {
    const result = await this.engagementService.share(user.id, postId, body.type, body.recipients)
    return { data: result }
  }
}
