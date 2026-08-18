/**
 * Detects a signed-in-but-hidden account, and restores it on request.
 *
 * The web app signs in straight against Supabase for email and phone, so the
 * API's login response is not on that path at all. What every path does hit is
 * JwtAuthGuard, which refuses a deactivated or pending-deletion account with a
 * distinct code and — since this change — the date it happened. Probing one cheap
 * authenticated route after sign-in is therefore the only check that works for
 * password, username and social sign-in alike.
 */

const HIDDEN_CODES: Record<string, 'deactivated' | 'pending_deletion'> = {
  ACCOUNT_DEACTIVATED: 'deactivated',
  ACCOUNT_PENDING_DELETION: 'pending_deletion',
}

export interface HiddenAccount {
  state: 'deactivated' | 'pending_deletion'
  since: string | null
}

function apiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? ''
}

/**
 * Returns the hidden state if the freshly signed-in account is one, else null.
 *
 * Deliberately fails open: a network blip must not strand someone on a
 * reactivation prompt they cannot dismiss, and if the account really is hidden
 * every subsequent route refuses it anyway.
 */
export async function detectHiddenAccount(accessToken: string): Promise<HiddenAccount | null> {
  try {
    const res = await fetch(`${apiBase()}/api/v1/profiles/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (res.ok) return null

    const body = await res.json().catch(() => null)
    const err = body?.error ?? body
    const state = err?.code ? HIDDEN_CODES[err.code] : undefined
    if (!state) return null
    return { state, since: typeof err.since === 'string' ? err.since : null }
  } catch {
    return null
  }
}

/** Restores the account. Returns null on success, or a message to show. */
export async function reactivateAccount(accessToken: string): Promise<string | null> {
  try {
    const res = await fetch(`${apiBase()}/api/v1/auth/reactivate`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (res.ok) return null
    const body = await res.json().catch(() => null)
    return body?.error?.message ?? body?.message ?? 'Could not reactivate your account'
  } catch {
    return 'Could not reactivate your account'
  }
}
