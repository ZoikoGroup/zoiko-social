import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

// Browser (client-side) Supabase client
// Uses the anon key — subject to RLS policies
// Safe to use in React components and client-side code
export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
