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
import {
  NetworkService,
  BlockUserSchema,
} from './network.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'

@Controller('network')
@UseGuards(JwtAuthGuard)
export class NetworkController {
  constructor(private readonly networkService: NetworkService) {}

  // ── FOLLOW / UNFOLLOW ─────────────────────────────────────────────────────

  @Post('follow/:userId')
  @HttpCode(HttpStatus.OK)
  async follow(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') targetUserId: string,
  ) {
    const result = await this.networkService.followUser(user.id, targetUserId)
    return { data: result }
  }

  @Delete('follow/:userId')
  @HttpCode(HttpStatus.OK)
  async unfollow(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') targetUserId: string,
  ) {
    await this.networkService.unfollowUser(user.id, targetUserId)
    return { data: { success: true } }
  }

  @Post('follow/:userId/remove')
  @HttpCode(HttpStatus.OK)
  async removeFollower(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') followerId: string,
  ) {
    await this.networkService.removeFollower(user.id, followerId)
    return { data: { success: true } }
  }

  /** Cancel an outgoing follow request (click on "Requested"). */
  @Delete('follow/:userId/request')
  @HttpCode(HttpStatus.OK)
  async cancelFollowRequest(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') receiverId: string,
  ) {
    await this.networkService.cancelFollowRequest(user.id, receiverId)
    return { data: { success: true } }
  }

  // ── FOLLOW REQUESTS ───────────────────────────────────────────────────────

  @Get('requests')
  async getFollowRequests(
    @CurrentUser() user: AuthenticatedUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.networkService.getFollowRequests(
      user.id,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    )
    return { data: result }
  }

  @Post('requests/:id/accept')
  @HttpCode(HttpStatus.OK)
  async acceptRequest(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') requestId: string,
  ) {
    await this.networkService.respondToFollowRequest(requestId, user.id, 'accept')
    return { data: { success: true } }
  }

  @Post('requests/:id/reject')
  @HttpCode(HttpStatus.OK)
  async rejectRequest(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') requestId: string,
  ) {
    await this.networkService.respondToFollowRequest(requestId, user.id, 'reject')
    return { data: { success: true } }
  }

  // ── FOLLOWERS / FOLLOWING ─────────────────────────────────────────────────

  @Get('followers/:userId')
  async getFollowers(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') targetUserId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    const result = await this.networkService.getFollowers(
      targetUserId,
      user.id,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      cursor,
    )
    return { data: result }
  }

  @Get('following/:userId')
  async getFollowing(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') targetUserId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
  ) {
    const result = await this.networkService.getFollowing(
      targetUserId,
      user.id,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
      cursor,
    )
    return { data: result }
  }

  @Get('mutual-followers/:userId')
  async getMutualFollowers(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') targetUserId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.networkService.getMutualFollowers(
      user.id,
      targetUserId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    )
    return { data: result }
  }

  @Get('mutual-following/:userId')
  async getMutualFollowing(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') targetUserId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.networkService.getMutualFollowing(
      user.id,
      targetUserId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 20,
    )
    return { data: result }
  }

  // ── SEARCH ────────────────────────────────────────────────────────────────

  @Get('search')
  async searchUsers(
    @CurrentUser() user: AuthenticatedUser,
    @Query('q') q?: string,
    @Query('limit') limit?: string,
  ) {
    const result = await this.networkService.searchUsers(
      user.id,
      q ?? '',
      limit ? parseInt(limit, 10) : 20,
    )
    return { data: result }
  }

  // ── SUGGESTIONS ───────────────────────────────────────────────────────────

  @Get('suggestions')
  async getSuggestions(
    @CurrentUser() user: AuthenticatedUser,
    @Query('limit') limit?: string,
  ) {
    const result = await this.networkService.getSuggestions(
      user.id,
      limit ? parseInt(limit, 10) : 10,
    )
    return { data: result }
  }

  // ── BLOCK / UNBLOCK ──────────────────────────────────────────────────────

  @Post('block/:userId')
  @HttpCode(HttpStatus.OK)
  async blockUser(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') targetUserId: string,
    @Body(new ZodValidationPipe(BlockUserSchema)) body: { reason?: string },
  ) {
    await this.networkService.blockUser(user.id, targetUserId, body.reason)
    return { data: { success: true } }
  }

  @Delete('block/:userId')
  @HttpCode(HttpStatus.OK)
  async unblockUser(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') targetUserId: string,
  ) {
    await this.networkService.unblockUser(user.id, targetUserId)
    return { data: { success: true } }
  }

  @Get('blocked')
  async getBlockedUsers(@CurrentUser() user: AuthenticatedUser) {
    const result = await this.networkService.getBlockedUsers(user.id)
    return { data: result }
  }

  // ── MUTE / UNMUTE ────────────────────────────────────────────────────────

  @Post('mute/:userId')
  @HttpCode(HttpStatus.OK)
  async muteUser(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') targetUserId: string,
  ) {
    await this.networkService.muteUser(user.id, targetUserId)
    return { data: { success: true } }
  }

  @Delete('mute/:userId')
  @HttpCode(HttpStatus.OK)
  async unmuteUser(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') targetUserId: string,
  ) {
    await this.networkService.unmuteUser(user.id, targetUserId)
    return { data: { success: true } }
  }

  @Get('muted')
  async getMutedUsers(@CurrentUser() user: AuthenticatedUser) {
    const result = await this.networkService.getMutedUsers(user.id)
    return { data: result }
  }
}
