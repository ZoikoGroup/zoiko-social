import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// App routes that require authentication
const PROTECTED_ROUTES = [
  '/',           // Home feed
  '/adoption',
  '/breeding-match',
  '/communities',
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
]

// Auth pages — redirect to app if already signed in
const AUTH_ROUTES = ['/login', '/signup', '/register', '/forgot-password', '/reset-password']

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  let response: NextResponse
  let isAuthenticated = false
  try {
    const result = await updateSession(request)
    response = result.response
    isAuthenticated = !!result.user
  } catch (error) {
    console.error('[middleware] updateSession failed:', error)
    response = NextResponse.next({ request })
  }

  // Protected routes — redirect to /login if not authenticated
  const isProtected = PROTECTED_ROUTES.some((route) => {
    if (route === '/') return pathname === '/'
    return pathname.startsWith(route)
  })
  if (isProtected && !isAuthenticated) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('next', pathname)
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
