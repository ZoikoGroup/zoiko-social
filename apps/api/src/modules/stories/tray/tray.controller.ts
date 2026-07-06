import { Controller, Get, Param, UseGuards, NotFoundException } from '@nestjs/common'
import { TrayService } from './tray.service'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../../auth/guards/jwt-auth.guard'

@Controller('stories')
export class TrayController {
  constructor(private readonly trayService: TrayService) {}

  /**
   * GET /stories/tray
   * Returns the viewer's story tray — ordered rings (own → unseen → seen).
   * Each ring contains lightweight story summaries (id, type, poster, blurhash,
   * duration, seen flag).
   *
   * The tray payload is intentionally light; full media loads lazily when the
   * viewer opens a ring.
   */
  @Get('tray')
  @UseGuards(JwtAuthGuard)
  async getTray(@CurrentUser() user: AuthenticatedUser) {
    const result = await this.trayService.getTray(user.id)
    return { data: result }
  }

  /**
   * GET /stories/user/:userId
   * Returns a single author's active story ring — used when the viewer taps
   * a specific user's ring (e.g. from the profile page).
   */
  @Get('user/:userId')
  @UseGuards(JwtAuthGuard)
  async getUserRing(
    @CurrentUser() user: AuthenticatedUser,
    @Param('userId') userId: string,
  ) {
    const ring = await this.trayService.getUserRing(user.id, userId)
    if (!ring) {
      throw new NotFoundException({ code: 'NO_STORIES', message: 'No active stories for this user' })
    }
    return { data: ring }
  }
}
