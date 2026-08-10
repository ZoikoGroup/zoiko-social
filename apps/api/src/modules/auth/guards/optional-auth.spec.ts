import { UnauthorizedException } from '@nestjs/common'
import type { ExecutionContext } from '@nestjs/common'
import { OPTIONAL_AUTH_KEY, OptionalAuthGuard } from './optional-auth.guard'
import { AUTH_USER_KEY } from './jwt-auth.guard'

/**
 * `CurrentUser` is a param decorator, and Nest gives no public way to invoke one
 * directly, so this exercises the same resolution logic against a fake request.
 * Kept in lockstep with current-user.decorator.ts by hand — the behaviour is
 * worth pinning even so, because it silently broke 62 routes once already.
 */
function resolveCurrentUser(request: Record<string, unknown>): unknown {
  const user = request[AUTH_USER_KEY]
  if (!user) {
    if (request[OPTIONAL_AUTH_KEY] === true) return undefined
    throw new UnauthorizedException({ code: 'USER_NOT_FOUND', message: 'Authenticated user not found in request' })
  }
  return user
}

const USER = { id: 'member-1', email: 'a@b.c' }

describe('CurrentUser resolution', () => {
  it('returns the user when one is attached', () => {
    expect(resolveCurrentUser({ [AUTH_USER_KEY]: USER })).toEqual(USER)
  })

  it('returns undefined for an anonymous caller on an optionally-authed route', () => {
    // This is the case that was broken: OptionalAuthGuard swallowed its own
    // error and then the decorator threw a fresh one, so every public endpoint
    // answered 401 to logged-out visitors.
    expect(resolveCurrentUser({ [OPTIONAL_AUTH_KEY]: true })).toBeUndefined()
  })

  it('still throws when no guard has marked the route optional', () => {
    // On an unguarded route the throw is the only thing between an anonymous
    // caller and a handler written to assume a user, so it has to stay.
    expect(() => resolveCurrentUser({})).toThrow(UnauthorizedException)
  })

  it('prefers the real user over the optional flag', () => {
    // A signed-in visitor to a public page must still be recognised.
    expect(resolveCurrentUser({ [OPTIONAL_AUTH_KEY]: true, [AUTH_USER_KEY]: USER })).toEqual(USER)
  })

  it('does not treat a truthy-but-not-true flag as permission', () => {
    // Guards set the flag to exactly `true`; anything else is not a guard.
    expect(() => resolveCurrentUser({ [OPTIONAL_AUTH_KEY]: 'yes' })).toThrow(UnauthorizedException)
  })
})

describe('OptionalAuthGuard', () => {
  /** Minimal ExecutionContext exposing one mutable request object. */
  function contextFor(request: Record<string, unknown>): ExecutionContext {
    return {
      switchToHttp: () => ({ getRequest: () => request }),
    } as unknown as ExecutionContext
  }

  /** The real guard, with its two injected dependencies stubbed out. */
  function guard(): OptionalAuthGuard {
    return new OptionalAuthGuard(
      {} as unknown as ConstructorParameters<typeof OptionalAuthGuard>[0],
      {} as unknown as ConstructorParameters<typeof OptionalAuthGuard>[1],
    )
  }

  it('admits an anonymous caller and flags the request', async () => {
    // No Authorization header, so JwtAuthGuard throws and this swallows it. The
    // flag must be set anyway — that anonymous case is the whole point.
    const request: Record<string, unknown> = { headers: {} }

    const allowed = await guard().canActivate(contextFor(request))

    expect(allowed).toBe(true)
    expect(request[OPTIONAL_AUTH_KEY]).toBe(true)
    // With the flag set, the decorator yields undefined instead of a 401.
    expect(resolveCurrentUser(request)).toBeUndefined()
  })

  it('flags the request even when the token is present but invalid', async () => {
    // A stale or malformed token must degrade to anonymous on a public route,
    // not 401 — otherwise an expired session breaks browsing entirely.
    const request: Record<string, unknown> = { headers: { authorization: 'Bearer nonsense' } }

    const allowed = await guard().canActivate(contextFor(request))

    expect(allowed).toBe(true)
    expect(request[OPTIONAL_AUTH_KEY]).toBe(true)
  })
})
