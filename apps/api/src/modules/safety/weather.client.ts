import { Injectable, Logger } from '@nestjs/common'

/**
 * Reads current conditions from Open-Meteo.
 *
 * Chosen because it needs no API key and no signup, so the feature works in every
 * environment without a credential to provision. Two endpoints are used: the
 * forecast API for weather, and the air-quality API for PM2.5/AQI, which matters
 * for flat-faced breeds and any animal with a respiratory condition.
 *
 * Uses the runtime's built-in `fetch` rather than adding an SDK. Every failure
 * resolves to `null` instead of throwing — a missing advisory is a non-event, and
 * an outage upstream must never break the page it sits on.
 */

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const AIR_QUALITY_URL = 'https://air-quality-api.open-meteo.com/v1/air-quality'
const REQUEST_TIMEOUT_MS = 6_000

/** Everything the advisory rules need, in metric units. */
export interface WeatherSnapshot {
  temperatureC: number
  /** "Feels like" — what actually matters for heat and cold stress. */
  apparentTemperatureC: number
  humidityPct: number
  precipitationMm: number
  windSpeedKph: number
  uvIndex: number
  /** WMO code — see WEATHER_CODES in advisories.ts. */
  weatherCode: number
  /** US AQI, when the air-quality call succeeded. */
  usAqi: number | null
  pm25: number | null
  observedAt: string
}

interface ForecastResponse {
  current?: {
    time?: string
    temperature_2m?: number
    apparent_temperature?: number
    relative_humidity_2m?: number
    precipitation?: number
    wind_speed_10m?: number
    uv_index?: number
    weather_code?: number
  }
}

interface AirQualityResponse {
  current?: { us_aqi?: number; pm2_5?: number }
}

@Injectable()
export class WeatherClient {
  private readonly logger = new Logger(WeatherClient.name)

  async fetchSnapshot(latitude: number, longitude: number): Promise<WeatherSnapshot | null> {
    // Air quality is a bonus signal: if only that call fails the advisories still
    // work, so the two are fetched together and the weather one is the hard
    // requirement.
    const [forecast, air] = await Promise.all([
      this.get<ForecastResponse>(FORECAST_URL, {
        latitude: String(latitude),
        longitude: String(longitude),
        current: 'temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,uv_index',
        timezone: 'auto',
      }),
      this.get<AirQualityResponse>(AIR_QUALITY_URL, {
        latitude: String(latitude),
        longitude: String(longitude),
        current: 'pm2_5,us_aqi',
        timezone: 'auto',
      }),
    ])

    const current = forecast?.current
    if (!current || current.temperature_2m === undefined) {
      this.logger.warn(`No current weather for ${latitude},${longitude}`)
      return null
    }

    return {
      temperatureC: current.temperature_2m,
      apparentTemperatureC: current.apparent_temperature ?? current.temperature_2m,
      humidityPct: current.relative_humidity_2m ?? 0,
      precipitationMm: current.precipitation ?? 0,
      windSpeedKph: current.wind_speed_10m ?? 0,
      uvIndex: current.uv_index ?? 0,
      weatherCode: current.weather_code ?? 0,
      usAqi: air?.current?.us_aqi ?? null,
      pm25: air?.current?.pm2_5 ?? null,
      observedAt: current.time ?? new Date().toISOString(),
    }
  }

  private async get<T>(url: string, params: Record<string, string>): Promise<T | null> {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS)
    try {
      const response = await fetch(`${url}?${new URLSearchParams(params).toString()}`, {
        signal: controller.signal,
        headers: { Accept: 'application/json' },
      })
      if (!response.ok) {
        this.logger.warn(`${url} responded ${response.status}`)
        return null
      }
      return (await response.json()) as T
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error)
      this.logger.warn(`${url} failed: ${reason}`)
      return null
    } finally {
      clearTimeout(timeout)
    }
  }
}
