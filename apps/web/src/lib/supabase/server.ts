import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

// Common subset compatible with both @supabase/ssr CookieOptions and Next.js ResponseCookie.
// Avoids importing internal Next.js types or CookieSerializeOptions.
type CookieSetItem = {
  name: string
  value: string
  options?: {
    domain?: string
    expires?: Date
    httpOnly?: boolean
    maxAge?: number
    path?: string
    sameSite?: 'strict' | 'lax' | 'none'
    secure?: boolean
  }
}

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: CookieSetItem[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              // Pass Supabase's options through unchanged — the auth cookie must
              // stay readable by the browser SDK. Object-form overload avoids the
              // tuple type mismatch between supabase and next.js cookie options.
              cookieStore.set({ name, value, ...options })
            })
          } catch {
            // Called from a Server Component — read-only context, middleware handles refresh
          }
        },
      },
    }
  )
}

// There is deliberately no admin client here.
//
// One used to live in this file, built on SUPABASE_SERVICE_ROLE_KEY — the key
// that bypasses Row Level Security. Nothing ever called it and the variable was
// never set for this app, so it did nothing; but SETUP.md's rule is that the
// service-role key must never appear in apps/web at all, and a ready-made
// RLS-bypassing constructor sitting here is an invitation. The day someone adds
// that variable to the Vercel project, an RLS bypass goes live in the web tier
// with no code change to review.
//
// Anything needing service-role access belongs behind the API, which already
// holds the key and applies its own guards. `import 'server-only'` above stops
// a client component importing this module, but it cannot stop a server action
// from misusing an admin client that exists.
