import { createClient } from '@/lib/supabase/client'

/**
 * Get the current Supabase session access token for authenticating
 * API requests. Returns null when no session exists (not signed in).
 *
 * Usage:
 *   const token = await getAuthToken()
 *   fetch(url, { headers: { Authorization: `Bearer ${token}` } })
 */
export async function getAuthToken(): Promise<string | null> {
  const { data: { session } } = await createClient().auth.getSession()
  return session?.access_token ?? null
}
