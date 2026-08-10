import { deriveAdvisories, type AdvisoryKind } from './advisories'
import type { WeatherSnapshot } from './weather.client'

/** A mild, unremarkable day — nothing should fire from this baseline. */
function snapshot(overrides: Partial<WeatherSnapshot> = {}): WeatherSnapshot {
  return {
    temperatureC: 20,
    apparentTemperatureC: 20,
    humidityPct: 50,
    precipitationMm: 0,
    windSpeedKph: 10,
    uvIndex: 3,
    weatherCode: 1,
    usAqi: 40,
    pm25: 8,
    observedAt: '2026-07-31T12:00',
    ...overrides,
  }
}

/** Mirrors apps/web/src/app/docs/* — a link outside this set is a dead link. */
const EXISTING_DOCS_ROUTES = [
  '/docs/getting-started', '/docs/profile-and-pets', '/docs/feed-and-content',
  '/docs/community-and-events', '/docs/messaging-and-calls', '/docs/marketplace-and-services',
  '/docs/news', '/docs/notifications-and-settings', '/docs/safety-and-trust',
  '/docs/adoption-and-lost-found', '/docs/faq',
]

const kinds = (s: Partial<WeatherSnapshot>): AdvisoryKind[] =>
  deriveAdvisories(snapshot(s)).map((a) => a.kind)

describe('deriveAdvisories — quiet conditions', () => {
  it('returns nothing on a mild day', () => {
    // The common case. A banner that always shows something is noise, and members
    // stop reading it — which is exactly what makes a real alert useless.
    expect(deriveAdvisories(snapshot())).toEqual([])
  })

  it('returns nothing for light rain or ordinary cloud', () => {
    expect(kinds({ weatherCode: 3 })).toEqual([])
    expect(kinds({ weatherCode: 61, precipitationMm: 1.2 })).toEqual([])
  })
})

describe('deriveAdvisories — heat', () => {
  it('warns at 29°C apparent and escalates past 35°C', () => {
    expect(kinds({ apparentTemperatureC: 29 })).toContain('heat')
    expect(kinds({ apparentTemperatureC: 36 })).toContain('extreme_heat')
  })

  it('does not fire just below the threshold', () => {
    expect(kinds({ apparentTemperatureC: 28.9 })).toEqual([])
  })

  it('reads the apparent temperature, not the air temperature', () => {
    // Humidity is what turns a warm day dangerous for a panting animal, so 26°C
    // that feels like 34°C must still warn.
    expect(kinds({ temperatureC: 26, apparentTemperatureC: 34, humidityPct: 90 })).toContain('heat')
    expect(kinds({ temperatureC: 34, apparentTemperatureC: 26 })).toEqual([])
  })

  it('mentions the pavement, which is the part members do not expect', () => {
    const [advisory] = deriveAdvisories(snapshot({ apparentTemperatureC: 31 }))
    expect(advisory?.message.toLowerCase()).toContain('pavement')
  })

  it('quotes the temperature it is warning about', () => {
    const [advisory] = deriveAdvisories(snapshot({ apparentTemperatureC: 37.4 }))
    expect(advisory?.message).toContain('37°C')
  })

  it('raises only one heat advisory, not both tiers', () => {
    const result = kinds({ apparentTemperatureC: 40 })
    expect(result).toContain('extreme_heat')
    expect(result).not.toContain('heat')
  })
})

describe('deriveAdvisories — cold', () => {
  it('warns at 2°C and escalates past -8°C', () => {
    expect(kinds({ apparentTemperatureC: 1 })).toContain('cold')
    expect(kinds({ apparentTemperatureC: -12 })).toContain('extreme_cold')
  })

  it('raises only one cold advisory', () => {
    const result = kinds({ apparentTemperatureC: -15 })
    expect(result).toContain('extreme_cold')
    expect(result).not.toContain('cold')
  })

  it('mentions paws, salt or frostbite — the actual hazards', () => {
    const [advisory] = deriveAdvisories(snapshot({ apparentTemperatureC: 0 }))
    expect(advisory?.message.toLowerCase()).toMatch(/paw|salt|grit|frostbite/)
  })
})

describe('deriveAdvisories — thunderstorms', () => {
  it.each([95, 96, 99])('fires on WMO %i', (weatherCode) => {
    expect(kinds({ weatherCode })).toContain('thunderstorm')
  })

  it('is always severe — storms are when animals bolt and go missing', () => {
    const [advisory] = deriveAdvisories(snapshot({ weatherCode: 95 }))
    expect(advisory?.severity).toBe('severe')
    expect(advisory?.message.toLowerCase()).toMatch(/indoors|microchip|collar/)
  })

  it('calls out hail separately', () => {
    const withHail = deriveAdvisories(snapshot({ weatherCode: 99 }))[0]
    const without = deriveAdvisories(snapshot({ weatherCode: 95 }))[0]
    expect(withHail?.title.toLowerCase()).toContain('hail')
    expect(without?.title.toLowerCase()).not.toContain('hail')
  })

  it('points at the lost-and-found guide, not general pet care', () => {
    const [advisory] = deriveAdvisories(snapshot({ weatherCode: 95 }))
    expect(advisory?.docsPath).toContain('lost-found')
  })
})

describe('deriveAdvisories — precipitation and ice', () => {
  it.each([71, 73, 75, 77, 85, 86])('flags snow on WMO %i', (weatherCode) => {
    expect(kinds({ weatherCode })).toContain('snow_ice')
  })

  it.each([56, 57, 66, 67])('flags freezing conditions on WMO %i', (weatherCode) => {
    expect(kinds({ weatherCode })).toContain('snow_ice')
  })

  it('warns about de-icer and antifreeze, which are the toxic part', () => {
    const [advisory] = deriveAdvisories(snapshot({ weatherCode: 71 }))
    expect(advisory?.message.toLowerCase()).toMatch(/salt|de-icer|antifreeze/)
  })

  it('flags heavy rain by volume or by code', () => {
    expect(kinds({ precipitationMm: 9 })).toContain('heavy_rain')
    expect(kinds({ weatherCode: 82 })).toContain('heavy_rain')
  })
})

describe('deriveAdvisories — air, UV and wind', () => {
  it('warns when AQI is unhealthy and escalates past 200', () => {
    expect(kinds({ usAqi: 160 })).toContain('poor_air')
    const [severe] = deriveAdvisories(snapshot({ usAqi: 210 }))
    expect(severe?.severity).toBe('severe')
  })

  it('stays quiet on moderate air', () => {
    expect(kinds({ usAqi: 120 })).toEqual([])
  })

  it('handles a missing air-quality reading without firing', () => {
    // The air-quality call is allowed to fail on its own.
    expect(kinds({ usAqi: null, pm25: null })).toEqual([])
  })

  it('names flat-faced breeds, who are affected first', () => {
    const [advisory] = deriveAdvisories(snapshot({ usAqi: 180 }))
    expect(advisory?.message.toLowerCase()).toMatch(/flat-faced|pug|persian/)
  })

  it('flags high UV and strong wind as info only', () => {
    const uv = deriveAdvisories(snapshot({ uvIndex: 9 }))[0]
    expect(uv?.kind).toBe('high_uv')
    expect(uv?.severity).toBe('info')

    const wind = deriveAdvisories(snapshot({ windSpeedKph: 60 }))[0]
    expect(wind?.kind).toBe('high_wind')
    expect(wind?.severity).toBe('info')
  })

  it('flags fog', () => {
    expect(kinds({ weatherCode: 45 })).toContain('fog')
    expect(kinds({ weatherCode: 48 })).toContain('fog')
  })
})

describe('deriveAdvisories — ordering', () => {
  it('puts the most serious first, so showing one shows the right one', () => {
    const result = deriveAdvisories(snapshot({
      apparentTemperatureC: 30, // warning
      uvIndex: 10,              // info
      weatherCode: 95,          // severe
    }))
    expect(result.map((a) => a.severity)).toEqual(['severe', 'warning', 'info'])
    expect(result[0]?.kind).toBe('thunderstorm')
  })

  it('can raise several at once', () => {
    const result = kinds({ apparentTemperatureC: 36, uvIndex: 11, usAqi: 170, windSpeedKph: 55 })
    expect(result).toEqual(expect.arrayContaining(['extreme_heat', 'high_uv', 'poor_air', 'high_wind']))
  })

  it('gives every advisory a title, message and docs link', () => {
    const result = deriveAdvisories(snapshot({ apparentTemperatureC: 36, weatherCode: 95, usAqi: 200, uvIndex: 9 }))
    expect(result.length).toBeGreaterThan(2)
    for (const a of result) {
      expect(a.title.length).toBeGreaterThan(2)
      expect(a.message.length).toBeGreaterThan(30)
      // Must be a docs route that exists — /docs/pet-care did not, and every
      // advisory linked to it, so the guide button was a 404.
      expect(EXISTING_DOCS_ROUTES).toContain(a.docsPath)
    }
  })
})
