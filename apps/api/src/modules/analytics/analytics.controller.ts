import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common'
import { AnalyticsService } from './analytics.service'
import { IngestBatchSchema, type IngestBatchInput } from './analytics.schemas'
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { AuthenticatedUser } from '../auth/guards/jwt-auth.guard'

@Controller()
export class AnalyticsController {
  constructor(private readonly analytics: AnalyticsService) {}

  /** Batched impression/interaction ingest. Fire-and-forget from the client. */
  @Post('events/ingest')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  async ingest(
    @CurrentUser() user: AuthenticatedUser,
    @Body(new ZodValidationPipe(IngestBatchSchema)) body: IngestBatchInput,
    @Headers('user-agent') userAgent?: string,
    // Country injected by the CDN/edge (Vercel or Cloudflare) — no GeoIP DB.
    @Headers('x-vercel-ip-country') vercelCountry?: string,
    @Headers('cf-ipcountry') cfCountry?: string,
  ) {
    const result = await this.analytics.ingest(user.id, body.events, {
      userAgent: userAgent ?? null,
      country: vercelCountry ?? cfCountry ?? null,
    })
    return { data: result }
  }

  /** Per-post insights — restricted to the post's professional author. */
  @Get('analytics/posts/:id')
  @UseGuards(JwtAuthGuard)
  async postInsights(@CurrentUser() user: AuthenticatedUser, @Param('id') id: string) {
    return { data: await this.analytics.getPostInsights(user.id, id) }
  }
}
