import type { WeatherSnapshot } from './weather.client'

/**
 * Turns current conditions into pet-welfare advisories.
 *
 * A pure function on purpose: the thresholds are the substance of this feature, so
 * they need to be readable and testable without a network call.
 *
 * These are animal-welfare advisories, not a weather report. The member can get
 * the temperature anywhere; what they cannot get elsewhere is "the pavement will
 * burn your dog's paws right now". So each rule exists because it changes what
 * someone should do with their animal in the next hour.
 */

export type AdvisorySeverity = 'info' | 'warning' | 'severe'

export type AdvisoryKind =
  | 'extreme_heat'
  | 'heat'
  | 'thunderstorm'
  | 'extreme_cold'
  | 'cold'
  | 'snow_ice'
  | 'heavy_rain'
  | 'high_uv'
  | 'poor_air'
  | 'high_wind'
  | 'fog'

export interface Advisory {
  kind: AdvisoryKind
  severity: AdvisorySeverity
  /** Short label, rendered in bold. */
  title: string
  /** One sentence: what is happening and what to do about it. */
  message: string
  /** Relevant Help Center section. */
  docsPath: string
}

/** WMO weather interpretation codes, grouped by what they mean for a walk. */
const WMO = {
  fog: [45, 48],
  freezingDrizzle: [56, 57],
  heavyRain: [65, 67, 82],
  freezingRain: [66, 67],
  snow: [71, 73, 75, 77, 85, 86],
  thunderstorm: [95, 96, 99],
  /** Hail specifically — 96 and 99 are thunderstorm with hail. */
  hail: [96, 99],
}

/**
 * Thresholds. Heat and cold read the apparent ("feels like") temperature, because
 * humidity is what turns a warm day into a dangerous one for a panting animal.
 */
const T = {
  extremeHeatC: 35,
  heatC: 29,
  extremeColdC: -8,
  coldC: 2,
  heavyRainMm: 7.6,
  highUv: 8,
  unhealthyAqi: 150,
  highWindKph: 50,
}

const SEVERITY_ORDER: Record<AdvisorySeverity, number> = { severe: 0, warning: 1, info: 2 }

export function deriveAdvisories(snapshot: WeatherSnapshot): Advisory[] {
  const advisories: Advisory[] = []
  const feels = Math.round(snapshot.apparentTemperatureC)
  const code = snapshot.weatherCode

  // ── Heat. Asphalt runs roughly 20-30°C above air temperature in sun, which is
  // why this is the advisory members most need and least expect.
  if (snapshot.apparentTemperatureC >= T.extremeHeatC) {
    advisories.push({
      kind: 'extreme_heat',
      severity: 'severe',
      title: 'Extreme heat',
      message: `It feels like ${feels}°C. Pavement can be hot enough to burn paws — walk early morning or late evening only, never midday, and keep water available at all times.`,
      docsPath: '/docs/safety-and-trust',
    })
  } else if (snapshot.apparentTemperatureC >= T.heatC) {
    advisories.push({
      kind: 'heat',
      severity: 'warning',
      title: 'Heat advisory',
      message: `It feels like ${feels}°C. Press the back of your hand to the pavement for seven seconds before you walk — if you can't hold it there, it's too hot for paws.`,
      docsPath: '/docs/safety-and-trust',
    })
  }

  // ── Cold
  if (snapshot.apparentTemperatureC <= T.extremeColdC) {
    advisories.push({
      kind: 'extreme_cold',
      severity: 'severe',
      title: 'Extreme cold',
      message: `It feels like ${feels}°C. Keep trips outside very short — ears, tails and paws are at risk of frostbite, and small, thin-coated and elderly animals should not be out at all.`,
      docsPath: '/docs/safety-and-trust',
    })
  } else if (snapshot.apparentTemperatureC <= T.coldC) {
    advisories.push({
      kind: 'cold',
      severity: 'warning',
      title: 'Cold advisory',
      message: `It feels like ${feels}°C. Short-coated and elderly animals need a coat, and paws should be wiped after walks to get grit and salt off before they lick it.`,
      docsPath: '/docs/safety-and-trust',
    })
  }

  // ── Thunderstorm. The welfare issue is panic, not the rain: more animals go
  // missing during storms than at any other time.
  if (WMO.thunderstorm.includes(code)) {
    const hail = WMO.hail.includes(code)
    advisories.push({
      kind: 'thunderstorm',
      severity: 'severe',
      title: hail ? 'Thunderstorm with hail' : 'Thunderstorm',
      message: `Bring animals indoors now${hail ? ' — hail can injure animals caught outside' : ''}. Storm noise causes panic and bolting, so keep them in a quiet interior room and check collars and microchip details are up to date.`,
      docsPath: '/docs/adoption-and-lost-found',
    })
  }

  // ── Snow and ice
  if (WMO.snow.includes(code) || WMO.freezingRain.includes(code) || WMO.freezingDrizzle.includes(code)) {
    advisories.push({
      kind: 'snow_ice',
      severity: 'warning',
      title: WMO.snow.includes(code) ? 'Snow' : 'Freezing conditions',
      message:
        'Wipe paws after every walk — road salt and de-icer are toxic if licked off, and ice balls between the toes are painful. Antifreeze is lethal in tiny amounts, so clean up any spills.',
      docsPath: '/docs/safety-and-trust',
    })
  }

  // ── Heavy rain
  if (snapshot.precipitationMm >= T.heavyRainMm || WMO.heavyRain.includes(code)) {
    advisories.push({
      kind: 'heavy_rain',
      severity: 'warning',
      title: 'Heavy rain',
      message:
        'Keep dogs leashed near swollen water and avoid standing water, which carries leptospirosis. Check on outdoor and community animals with somewhere dry to shelter.',
      docsPath: '/docs/safety-and-trust',
    })
  }

  // ── Air quality. Flat-faced breeds cannot cool or breathe efficiently, so poor
  // air hits them first and hardest.
  if (snapshot.usAqi !== null && snapshot.usAqi >= T.unhealthyAqi) {
    advisories.push({
      kind: 'poor_air',
      severity: snapshot.usAqi >= 200 ? 'severe' : 'warning',
      title: 'Poor air quality',
      message: `Air quality index is ${Math.round(snapshot.usAqi)}. Cut exercise short, especially for flat-faced breeds like pugs and Persians and for any animal with a heart or airway condition.`,
      docsPath: '/docs/safety-and-trust',
    })
  }

  // ── UV
  if (snapshot.uvIndex >= T.highUv) {
    advisories.push({
      kind: 'high_uv',
      severity: 'info',
      title: 'High UV',
      message: `UV index is ${Math.round(snapshot.uvIndex)}. Pale-skinned, thin-coated and recently clipped animals can burn — noses, ear tips and bellies are the usual spots, so keep them in shade.`,
      docsPath: '/docs/safety-and-trust',
    })
  }

  // ── Wind
  if (snapshot.windSpeedKph >= T.highWindKph) {
    advisories.push({
      kind: 'high_wind',
      severity: 'info',
      title: 'Strong wind',
      message: `Winds around ${Math.round(snapshot.windSpeedKph)} km/h. Debris and falling branches are the risk, and wind makes animals more likely to spook and pull, so keep them close and leashed.`,
      docsPath: '/docs/safety-and-trust',
    })
  }

  // ── Fog
  if (WMO.fog.includes(code)) {
    advisories.push({
      kind: 'fog',
      severity: 'info',
      title: 'Fog',
      message:
        'Drivers cannot see you. Keep animals leashed and close to you, and wear something reflective if you are walking near roads.',
      docsPath: '/docs/safety-and-trust',
    })
  }

  return sortBySeverity(advisories)
}

/** Most serious first, so a caller showing only one shows the one that matters. */
function sortBySeverity(advisories: Advisory[]): Advisory[] {
  return [...advisories].sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
}
