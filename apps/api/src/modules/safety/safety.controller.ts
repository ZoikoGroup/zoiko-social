import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common'
import { SafetyService } from './safety.service'
import { OptionalAuthGuard } from '../auth/guards/optional-auth.guard'

/**
 * Coordinates come from the browser's geolocation, so they are validated here
 * rather than trusted: an out-of-range value would otherwise be forwarded to the
 * upstream weather API as-is.
 */
function coordinate(raw: string | undefined, max: number, name: string): number {
  const value = raw === undefined ? NaN : Number(raw)
  if (!Number.isFinite(value) || Math.abs(value) > max) {
    throw new BadRequestException({
      code: 'INVALID_COORDINATES',
      message: `${name} must be a number between -${max} and ${max}`,
    })
  }
  return value
}

/**
 * Weather-driven welfare advisories are public: the answer depends only on the
 * coordinates, so there is nothing here to withhold from a signed-out visitor.
 */
@Controller('safety')
@UseGuards(OptionalAuthGuard)
export class SafetyController {
  constructor(private readonly safetyService: SafetyService) {}

  /**
   * Current pet-welfare advisories for a location, most serious first. An empty
   * list is a normal, common answer — it means conditions are fine.
   */
  @Get('advisories')
  async advisories(@Query('lat') lat?: string, @Query('lon') lon?: string) {
    const latitude = coordinate(lat, 90, 'lat')
    const longitude = coordinate(lon, 180, 'lon')

    const result = await this.safetyService.getAdvisories(latitude, longitude)
    // Null means the upstream lookup failed with nothing cached to fall back on.
    // Not an error worth surfacing — the caller simply shows nothing.
    return { data: result ?? { advisories: [], conditions: null } }
  }
}
