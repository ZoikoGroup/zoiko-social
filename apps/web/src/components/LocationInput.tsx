'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, Loader2, LocateFixed } from 'lucide-react'

/**
 * Advanced location input with place autocomplete, powered by Photon
 * (OpenStreetMap, keyless). Google-Maps-style features:
 *  - detailed two-line suggestions (bold name + full address)
 *  - near-me biasing: results near the user rank first (browser geolocation)
 *  - distance shown per result (e.g. "2.4 km")
 *  - "Use my current location" (reverse-geocodes to a full address)
 *
 * Free text is still allowed. Drop-in for a plain <input>: same
 * `value`/`onChange(string)`, `placeholder`, `className`, `maxLength`.
 * Use `wrapperClassName` for flex-row layouts.
 */
interface LocationInputProps {
  value: string
  onChange: (value: string) => void
  /** Called with the picked place's coordinates, or null when the text is edited manually. */
  onSelectCoords?: (coords: { lat: number; lng: number } | null) => void
  placeholder?: string
  className?: string
  wrapperClassName?: string
  maxLength?: number
}

interface PhotonProps {
  name?: string
  housenumber?: string
  street?: string
  suburb?: string
  district?: string
  neighbourhood?: string
  locality?: string
  city?: string
  town?: string
  village?: string
  county?: string
  state?: string
  postcode?: string
  country?: string
}
interface PhotonFeature {
  properties: PhotonProps
  geometry?: { coordinates?: [number, number] } // [lon, lat]
}
interface PhotonResponse { features?: PhotonFeature[] }

interface Suggestion {
  primary: string
  secondary: string
  full: string
  distanceKm: number | null
  lat: number | null
  lng: number | null
}

interface Coords { lat: number; lon: number }

/** Great-circle distance in km. */
function haversineKm(a: Coords, b: Coords): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLon = ((b.lon - a.lon) * Math.PI) / 180
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) * Math.cos((b.lat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`
  if (km < 100) return `${km.toFixed(1)} km`
  return `${Math.round(km)} km`
}

/** Build a Google-Maps-style two-line suggestion from a Photon feature. */
function buildSuggestion(f: PhotonFeature, origin: Coords | null): Suggestion | null {
  const p = f.properties
  const street = [p.housenumber, p.street].filter(Boolean).join(' ')
  const primary = p.name || street || p.city || p.town || p.village || p.state || p.country || ''
  if (!primary) return null

  const rest = [
    p.name ? street : '',
    p.neighbourhood,
    p.suburb,
    p.district,
    p.locality,
    p.city ?? p.town ?? p.village,
    p.county,
    p.state,
    p.postcode,
    p.country,
  ].filter((x): x is string => typeof x === 'string' && x.length > 0)

  const seen = new Set<string>([primary.toLowerCase()])
  const secondary = rest
    .filter((x) => {
      const k = x.toLowerCase()
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
    .join(', ')

  const coords = f.geometry?.coordinates
  const lng = coords ? coords[0] : null
  const lat = coords ? coords[1] : null
  const distanceKm = origin && lat !== null && lng !== null ? haversineKm(origin, { lon: lng, lat }) : null

  return { primary, secondary, full: [primary, secondary].filter(Boolean).join(', '), distanceKm, lat, lng }
}

export function LocationInput({
  value,
  onChange,
  onSelectCoords,
  placeholder,
  className = '',
  wrapperClassName = 'relative',
  maxLength,
}: LocationInputProps): React.JSX.Element {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [active, setActive] = useState(-1)
  const [coords, setCoords] = useState<Coords | null>(null)
  const [locating, setLocating] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const skipNextFetch = useRef(false)
  const geoRequested = useRef(false)

  const geoSupported = typeof navigator !== 'undefined' && 'geolocation' in navigator

  // Lazily ask for location on first focus so results can be biased near-me.
  const requestGeo = (): void => {
    if (geoRequested.current || !geoSupported) return
    geoRequested.current = true
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => { /* denied / unavailable — fall back to unbiased search */ },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    )
  }

  useEffect(() => {
    if (skipNextFetch.current) { skipNextFetch.current = false; return }
    const q = value.trim()

    let cancelled = false
    const timer = setTimeout(() => {
      if (cancelled) return
      if (q.length < 3) { setSuggestions([]); setLoading(false); return }
      setLoading(true)
      const bias = coords ? `&lat=${coords.lat}&lon=${coords.lon}` : ''
      fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=8&lang=en${bias}`)
        .then((r) => r.json() as Promise<PhotonResponse>)
        .then((data) => {
          if (cancelled) return
          const seen = new Set<string>()
          const items = (data.features ?? [])
            .map((f) => buildSuggestion(f, coords))
            .filter((s): s is Suggestion => s !== null)
            .filter((s) => (seen.has(s.full) ? false : (seen.add(s.full), true)))
          setSuggestions(items)
          setOpen(true)
          setActive(-1)
        })
        .catch(() => { if (!cancelled) setSuggestions([]) })
        .finally(() => { if (!cancelled) setLoading(false) })
    }, 300)
    return () => { cancelled = true; clearTimeout(timer) }
  }, [value, coords])

  useEffect(() => {
    const onDoc = (e: MouseEvent): void => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const select = (s: Suggestion): void => {
    skipNextFetch.current = true
    onChange(s.full)
    onSelectCoords?.(s.lat !== null && s.lng !== null ? { lat: s.lat, lng: s.lng } : null)
    setOpen(false)
    setSuggestions([])
  }

  // "Use my current location" — reverse-geocode the device position.
  const useMyLocation = (): void => {
    if (!geoSupported || locating) return
    setLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const here: Coords = { lat: pos.coords.latitude, lon: pos.coords.longitude }
        setCoords(here)
        fetch(`https://photon.komoot.io/reverse?lat=${here.lat}&lon=${here.lon}&lang=en`)
          .then((r) => r.json() as Promise<PhotonResponse>)
          .then((data) => {
            const first = data.features?.[0]
            const s = first ? buildSuggestion(first, here) : null
            if (s) { skipNextFetch.current = true; onChange(s.full); onSelectCoords?.({ lat: here.lat, lng: here.lon }) }
          })
          .catch(() => { /* ignore */ })
          .finally(() => { setLocating(false); setOpen(false) })
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
    )
  }

  const showDropdown = open && (suggestions.length > 0 || geoSupported)

  return (
    <div ref={boxRef} className={wrapperClassName}>
      <input
        value={value}
        onChange={(e) => { onChange(e.target.value); onSelectCoords?.(null) }}
        onFocus={() => { requestGeo(); setOpen(true) }}
        onKeyDown={(e) => {
          if (!open || suggestions.length === 0) return
          if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, suggestions.length - 1)) }
          else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)) }
          else if (e.key === 'Enter' && active >= 0) { e.preventDefault(); select(suggestions[active]!) }
          else if (e.key === 'Escape') setOpen(false)
        }}
        placeholder={placeholder}
        maxLength={maxLength}
        autoComplete="off"
        className={className}
      />
      {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-outline pointer-events-none" />}
      {showDropdown && (
        <ul className="absolute z-30 left-0 right-0 mt-1 bg-surface-container-lowest border border-outline-variant/40 rounded-xl shadow-xl overflow-hidden max-h-72 overflow-y-auto">
          {geoSupported && (
            <li>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={useMyLocation}
                className="w-full text-left flex items-center gap-2.5 px-3 py-2 text-label-sm font-medium text-primary hover:bg-surface-container cursor-pointer border-b border-outline-variant/20"
              >
                {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
                {locating ? 'Getting your location…' : 'Use my current location'}
              </button>
            </li>
          )}
          {suggestions.map((s, i) => (
            <li key={s.full}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => select(s)}
                className={`w-full text-left flex items-start gap-2.5 px-3 py-2 hover:bg-surface-container cursor-pointer ${i === active ? 'bg-surface-container' : ''}`}
              >
                <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-label-sm font-medium text-on-surface">{s.primary}</span>
                  {s.secondary && <span className="block truncate text-[11px] text-outline">{s.secondary}</span>}
                </span>
                {s.distanceKm !== null && (
                  <span className="flex-shrink-0 text-[11px] text-outline mt-0.5 tabular-nums">{formatDistance(s.distanceKm)}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
