import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// App routes that require authentication.
//
// `/dashboard` and `/admin` were missing, so both answered 200 to a signed-out
// visitor and relied on the page itself to render a "forbidden" panel. No data
// leaked — the API rejects those calls with 401 — but it read as a bug next to
// every other protected route, which redirects. They redirect now too.
//
// Deliberately absent, and public: /login and the other auth pages, /docs,
// /terms, /privacy, /search, /explore, /p/:id, /c/:slug, and the shared
// pet-passport link. Those have to work before someone has an account.
const PROTECTED_ROUTES = [
  '/',           // Home feed
  '/admin',
  '/adoption',
  '/breeding-match',
  '/communities',
  '/dashboard',
  '/events',
  '/messages',
  '/network',
  '/notifications',
  '/news',
  '/pet-diary',
  '/health-passport',
  '/pet-care',
  '/shop',
  '/profile',
  '/settings',
  '/lost-found',
  '/vet-finder',
  '/onboarding',
]

// Auth pages — redirect to app if already signed in
// Signed-in visitors are bounced off these to the app — being on them already
// authenticated means they took a wrong turn.
//
// /reset-password is deliberately absent. Arriving there with a session is the
// normal case, not a wrong turn: the visitor may already be signed in in this
// browser, and the recovery flow itself establishes a session so the new
// password can be set. Listing it sent everyone who followed a reset link
// straight to the feed instead of the form.
const AUTH_ROUTES = ['/login', '/signup', '/register', '/forgot-password']

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  let response: NextResponse
  let isAuthenticated = false
  try {
    const result = await updateSession(request)
    response = result.response
    isAuthenticated = !!result.user
  } catch (error) {
    console.error('[proxy] updateSession failed:', error)
    response = NextResponse.next({ request })
  }

  // Protected routes — redirect to /login if not authenticated
  const isProtected = PROTECTED_ROUTES.some((route) => {
    if (route === '/') return pathname === '/'
    return pathname.startsWith(route)
  })
  if (isProtected && !isAuthenticated) {
    const redirectUrl = new URL('/login', request.url)
    // Query included, not just the path: several pages carry their state there —
    // /settings?section=help is the one that shows it — and signing in used to
    // drop it, landing people on the default tab instead of where they were sent.
    redirectUrl.searchParams.set('next', pathname + request.nextUrl.search)
    return NextResponse.redirect(redirectUrl)
  }

  // Auth routes — redirect to / if already authenticated
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Internal API protection
  if (pathname.startsWith('/api/internal/')) {
    const isServerRequest =
      request.headers.get('x-internal-secret') === process.env.INTERNAL_API_SECRET
    if (!isServerRequest) {
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  // ── Dev-mode cache busting ──────────────────────────────────────────────
  // In development, prevent the browser from caching pages so that stale
  // content doesn't persist across dev server restarts. This fixes the
  // "works in incognito, blank in regular Chrome" issue caused by stale
  // cached HTML/JS bundles from previous server instances.
  if (process.env.NODE_ENV === 'development') {
    response.headers.set(
      'Cache-Control',
      'no-cache, no-store, must-revalidate, max-age=0',
    )
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
