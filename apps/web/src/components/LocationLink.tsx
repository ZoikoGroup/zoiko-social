'use client'

import { MapPin } from 'lucide-react'

/**
 * Renders a location string as a clickable element that opens Google Maps
 * (new tab / native Maps app on mobile) searching that address. Locations are
 * stored as free text (no coordinates), so we use the Maps search-query URL.
 *
 * Implemented as a role="link" span (not an <a>) so it can be safely embedded
 * inside cards that are themselves wrapped in a <Link>/<a> without producing
 * invalid nested anchors. It stops propagation so it never triggers the parent
 * card's navigation, and sits above overlay links via `relative z-20`.
 */
interface LocationLinkProps {
  location: string
  className?: string
  /** Show the pin icon (default true). */
  showIcon?: boolean
  iconClassName?: string
}

export function LocationLink({
  location,
  className = '',
  showIcon = true,
  iconClassName = 'w-4 h-4',
}: LocationLinkProps): React.JSX.Element {
  const open = (e: React.MouseEvent | React.KeyboardEvent): void => {
    e.stopPropagation()
    e.preventDefault()
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`,
      '_blank',
      'noopener,noreferrer',
    )
  }
  return (
    <span
      role="link"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') open(e) }}
      title={`Open "${location}" in Google Maps`}
      className={`relative z-20 inline-flex items-center gap-1 cursor-pointer hover:text-primary hover:underline transition-colors ${className}`}
    >
      {showIcon && <MapPin className={`${iconClassName} flex-shrink-0`} />}
      <span>{location}</span>
    </span>
  )
}
