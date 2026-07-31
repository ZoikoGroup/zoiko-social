import { Injectable, Logger } from '@nestjs/common'
import { WeatherClient, type WeatherSnapshot } from './weather.client'
import { deriveAdvisories, type Advisory } from './advisories'

/**
 * Location-based pet-welfare advisories.
 *
 * Results are cached in-process against a coarse location grid rather than exact
 * coordinates: weather does not differ meaningfully across ~11km, so everyone in a
 * city shares one upstream call. Deliberately not Redis-backed — Upstash is over
 * its request quota, and this cache is a courtesy to the upstream API rather than
 * something that needs to be consistent across pods.
 *
 * Rounding also means we never use a member's precise coordinates as a cache key,
 * which is a nice property for something derived from their live location.
 */

export interface AdvisoryResult {
  advisories: Advisory[]
  conditions: {
    temperatureC: number
    apparentTemperatureC: number
    humidityPct: number
    windSpeedKph: number
    uvIndex: number
    usAqi: number | null
    observedAt: string
  }
}

/** ~11km at the equator. Coarse enough to be shared, fine enough to be local. */
const GRID_PRECISION = 1
const CACHE_TTL_MS = 20 * 60 * 1000
const CACHE_MAX_ENTRIES = 500

@Injectable()
export class SafetyService {
  private readonly logger = new Logger(SafetyService.name)
  private readonly cache = new Map<string, { result: AdvisoryResult; expires: number }>()

  constructor(private readonly weather: WeatherClient) {}

  async getAdvisories(latitude: number, longitude: number): Promise<AdvisoryResult | null> {
    const key = this.gridKey(latitude, longitude)
    const hit = this.cache.get(key)
    if (hit && hit.expires > Date.now()) return hit.result

    const snapshot = await this.weather.fetchSnapshot(latitude, longitude)
    if (!snapshot) {
      // Serve a stale entry rather than nothing when the upstream call fails.
      return hit?.result ?? null
    }

    const result: AdvisoryResult = {
      advisories: deriveAdvisories(snapshot),
      conditions: this.summarise(snapshot),
    }
    this.remember(key, result)
    return result
  }

  private summarise(s: WeatherSnapshot): AdvisoryResult['conditions'] {
    return {
      temperatureC: Math.round(s.temperatureC),
      apparentTemperatureC: Math.round(s.apparentTemperatureC),
      humidityPct: Math.round(s.humidityPct),
      windSpeedKph: Math.round(s.windSpeedKph),
      uvIndex: Math.round(s.uvIndex * 10) / 10,
      usAqi: s.usAqi === null ? null : Math.round(s.usAqi),
      observedAt: s.observedAt,
    }
  }

  private gridKey(latitude: number, longitude: number): string {
    return `${latitude.toFixed(GRID_PRECISION)},${longitude.toFixed(GRID_PRECISION)}`
  }

  private remember(key: string, result: AdvisoryResult): void {
    if (this.cache.size >= CACHE_MAX_ENTRIES) {
      const oldest = this.cache.keys().next().value
      if (oldest !== undefined) this.cache.delete(oldest)
    }
    this.cache.set(key, { result, expires: Date.now() + CACHE_TTL_MS })
  }
}
