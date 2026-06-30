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
              // Object-form overload avoids tuple type mismatch between
              // CookieSerializeOptions (supabase) and ResponseCookie (next.js)
              cookieStore.set({
                name,
                value,
                ...options,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
              })
            })
          } catch {
            // Called from a Server Component — read-only context, middleware handles refresh
          }
        },
      },
    }
  )
}

// Admin client — bypasses RLS. NEVER expose to client bundle.
export async function createAdminClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: CookieSetItem[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set({ name, value, ...options })
            })
          } catch {
            // Read-only context
          }
        },
      },
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
