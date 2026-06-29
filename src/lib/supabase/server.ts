import 'server-only'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

// Server-side Supabase client (Server Components, Server Actions, Route Handlers)
// Uses the anon key + user's cookie — still subject to RLS
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
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                ...options,
                // Enforce secure cookie settings
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
              })
            })
          } catch {
            // setAll called from a Server Component — cookies() is read-only here.
            // Session will be refreshed in middleware instead.
          }
        },
      },
    }
  )
}

// Admin client — bypasses RLS using service role key
// ONLY use for trusted server-side operations (migrations, admin actions, webhooks)
// NEVER expose this client or the service role key to the browser
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
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // Read-only context
          }
        },
      },
      auth: {
        // Disable auto-refresh for admin client — it manages its own session
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
