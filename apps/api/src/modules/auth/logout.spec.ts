import { AuthService } from './auth.service'

/**
 * Logout.
 *
 * The bug these lock down: "Sign out of all devices" reported "Failed to log
 * out" to people who were, in fact, signed out. The guard verifies the JWT
 * locally against Supabase's JWKS, so a token stays cryptographically valid
 * after GoTrue has discarded its session — a refresh rotated it, another device
 * signed out globally, or the button was pressed twice. Every one of those threw.
 *
 * Logout has to be idempotent: if there is no session to end, the caller's goal
 * is met. What it must NOT do is claim success when a real outage means other
 * devices are still signed in.
 */

function build(signOutResult: { error: { message: string; status?: number } | null }) {
  const signOut = jest.fn().mockResolvedValue(signOutResult)
  const supabaseAdmin = { auth: { admin: { signOut } } }

  // Only the two collaborators logout touches are real; the rest of the
  // constructor is irrelevant to this behaviour.
  const service = Object.create(AuthService.prototype) as AuthService
  Object.assign(service, {
    supabaseAdmin,
    logger: { log: jest.fn(), error: jest.fn(), warn: jest.fn() },
  })
  return { service, signOut }
}

const OK = { error: null }

describe('logout — already-ended sessions are success, not failure', () => {
  it('succeeds when Supabase revokes the session', async () => {
    const { service, signOut } = build(OK)
    await expect(service.logout('token')).resolves.toEqual({ revokedEverywhere: true })
    expect(signOut).toHaveBeenCalledWith('token', 'global')
  })

  it('succeeds with no token at all — nothing to revoke is the goal state', async () => {
    const { service, signOut } = build(OK)
    await expect(service.logout(undefined)).resolves.toEqual({ revokedEverywhere: true })
    expect(signOut).not.toHaveBeenCalled()
  })

  it.each([401, 403, 404])('treats HTTP %s from GoTrue as already signed out', async (status) => {
    const { service } = build({ error: { message: 'Session from session_id not found', status } })
    await expect(service.logout('stale-token')).resolves.toEqual({ revokedEverywhere: true })
  })

  it.each([
    'Session from session_id claim in JWT does not exist',
    'session_not_found',
    'invalid JWT',
    'token is expired',
  ])('treats "%s" as already signed out', async (message) => {
    // Recognised by message as well as status, because GoTrue does not always
    // set one — and a second click on the button must not show an error.
    const { service } = build({ error: { message } })
    await expect(service.logout('stale-token')).resolves.toEqual({ revokedEverywhere: true })
  })
})

describe('logout — a real outage is reported, not hidden', () => {
  it('reports that other sessions were not revoked when Supabase is unreachable', async () => {
    // The caller is still signed out locally, but telling them every device was
    // signed out would be a comfortable lie.
    const { service } = build({ error: { message: 'fetch failed', status: 500 } })
    await expect(service.logout('token')).resolves.toEqual({ revokedEverywhere: false })
  })

  it('never throws, so the button can never leave somebody stuck', async () => {
    const { service } = build({ error: { message: 'upstream timeout', status: 504 } })
    await expect(service.logout('token')).resolves.toBeDefined()
  })
})
