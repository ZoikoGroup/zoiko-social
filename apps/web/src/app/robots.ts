import type { MetadataRoute } from 'next'

/**
 * Crawler rules.
 *
 * There were none, which is not the same as "crawl everything" by accident — it
 * is, and this app is a mix of public and private. Profiles, posts, adoption
 * listings and lost-pet reports are meant to be findable; a shared lost-dog post
 * that search engines cannot see is worth less to the person who posted it.
 * Everything else here is either behind a sign-in or personal.
 *
 * The private paths below already redirect anonymous visitors to the login page,
 * so this is not what protects them. It stops crawlers spending their budget on
 * redirects and stops a login page being indexed under a dozen different URLs.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        // Personal to one member
        '/settings',
        '/notifications',
        '/messages',
        '/dashboard',
        '/pet-diary',
        '/health-passport',
        '/pet-care/my-bookings',
        '/pet-care/dashboard',
        '/vet-finder/dashboard',
        '/shop/orders',
        '/shop/checkout',
        // Staff only
        '/admin',
        // Auth flows: nothing to index, and a password-reset URL carries a token
        '/login',
        '/signup',
        '/forgot-password',
        '/reset-password',
        '/onboarding',
        '/auth',
        // Shared by token rather than by being public
        '/pet-passport',
      ],
    },
  }
}
