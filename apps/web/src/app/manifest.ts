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
      // Real PNGs at the sizes launchers and the Play Store ask for. The
      // previous entry pointed at a 335 KB SVG that was a base64 PNG inside an
      // <svg> wrapper — installable in theory, unrenderable in Chromium.
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      // Maskable is a separate entry, not a second purpose on the same file:
      // Android crops to a circle or squircle, so the mark is inset to the ~80%
      // safe zone on an opaque background. A non-maskable icon gets its edges
      // shaved off instead. 512 maskable is also what Play Store packaging needs.
      { src: '/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  }
}
