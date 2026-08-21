import type { MetadataRoute } from 'next'

/**
 * Web app manifest.
 *
 * Two things need this. Installing to a home screen is the obvious one, and on
 * iOS it is the only way web push works at all — Safari delivers push to
 * installed PWAs and to nothing else. The less obvious one is Play Store
 * packaging: a Trusted Web Activity is built from a manifest, so this file is the
 * entry ticket for shipping the site as an Android app.
 *
 * `display: 'standalone'` is what makes an installed copy open without browser
 * chrome, which is also what makes a notification tap feel like it opened an app
 * rather than a tab.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ZoikoSocial — Animal Welfare Network',
    short_name: 'ZoikoSocial',
    description:
      'The animal welfare network: adoption, rescue, lost and found pets, vets, communities and pet care.',
    start_url: '/',
    // Opening on the feed rather than a marketing page: someone who installed
    // this already knows what it is.
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0b0f14',
    theme_color: '#0b0f14',
    categories: ['social', 'lifestyle'],
    icons: [
      // The SVG scales to every size a launcher asks for, which is what makes the
      // app installable without shipping one PNG per density.
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon-500.png',
        sizes: '500x500',
        type: 'image/png',
        purpose: 'any',
      },
    ],
  }
}
