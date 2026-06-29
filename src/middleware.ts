import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

// Routes that require authentication
const PROTECTED_ROUTES = [
  '/feed',
  '/communities',
  '/messages',
  '/notifications',
  '/profile',
  '/settings',
  '/pet-diary',
  '/health-passport',
  '/pet-care',
  '/products',
  '/breeding-match',
  '/vet-finder',
  '/events',
  '/adoption',
]

// Routes only for unauthenticated users
const AUTH_ROUTES = ['/login', '/register', '/forgot-password']

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  // 1. Refresh Supabase session cookie
  const response = await updateSession(request)

  // 2. Check authentication state from the session cookie
  const sessionCookie = request.cookies.get('sb-access-token')
  const isAuthenticated = !!sessionCookie

  // 3. Redirect unauthenticated users away from protected routes
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  if (isProtected && !isAuthenticated) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // 4. Redirect authenticated users away from auth pages
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/feed', request.url))
  }

  // 5. Block direct access to internal API routes from browser (non-API clients)
  if (pathname.startsWith('/api/internal/')) {
    const isServerRequest = request.headers.get('x-internal-secret') === process.env.INTERNAL_API_SECRET
    if (!isServerRequest) {
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
