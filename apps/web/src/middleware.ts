import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

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
  '/events',
]

const AUTH_ROUTES = ['/login', '/register', '/forgot-password']

export async function middleware(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl

  let response: NextResponse
  try {
    response = await updateSession(request)
  } catch (error) {
    console.error('[middleware] updateSession failed:', error)
    response = NextResponse.next({ request })
  }

  const sessionCookie = request.cookies.get('sb-access-token')
  const isAuthenticated = !!sessionCookie

  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  if (isProtected && !isAuthenticated) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/feed', request.url))
  }

  if (pathname.startsWith('/api/internal/')) {
    const isServerRequest =
      request.headers.get('x-internal-secret') === process.env.INTERNAL_API_SECRET
    if (!isServerRequest) {
      return new NextResponse('Forbidden', { status: 403 })
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
