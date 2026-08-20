import {
  AccountStateCache,
  ACCOUNT_STATE_TTL_MS,
  ACCOUNT_STATE_MAX_ENTRIES,
  type AccountState,
} from './account-state-cache'

/*
 * This cache sits in front of a Trust & Safety check, so the tests that matter
 * are the ones about *not* serving a stale answer: that an entry stops being used
 * once the window passes, and that invalidating one takes effect at once. The
 * speed it buys is uninteresting if a suspended member keeps getting through.
 */

const ACTIVE: AccountState = { state: 'active', deactivatedAt: null, deletionRequestedAt: null }
const SUSPENDED: AccountState = { state: 'suspended', deactivatedAt: null, deletionRequestedAt: null }
const USER = 'user-1'
const T0 = 1_000_000

describe('AccountStateCache', () => {
  let cache: AccountStateCache

  beforeEach(() => {
    cache = new AccountStateCache()
  })

  it('misses when nothing has been stored', () => {
    expect(cache.get(USER, T0)).toBeNull()
  })

  it('returns a stored state within the window', () => {
    cache.set(USER, ACTIVE, T0)
    expect(cache.get(USER, T0 + ACCOUNT_STATE_TTL_MS - 1)).toEqual({ value: ACTIVE })
  })

  it('stops returning it once the window has passed', () => {
    cache.set(USER, ACTIVE, T0)
    expect(cache.get(USER, T0 + ACCOUNT_STATE_TTL_MS)).toBeNull()
  })

  it('forgets an entry on demand, so a suspension bites immediately', () => {
    cache.set(USER, ACTIVE, T0)
    cache.invalidate(USER)
    expect(cache.get(USER, T0)).toBeNull()
  })

  it('keeps a refusal cached too — a stale "suspended" fails closed', () => {
    cache.set(USER, SUSPENDED, T0)
    expect(cache.get(USER, T0 + 1)).toEqual({ value: SUSPENDED })
  })

  // A member with no profile row is a real answer, not an absent one: caching it
  // stops every request re-asking a question the database has already answered.
  it('caches the absence of a profile', () => {
    cache.set(USER, null, T0)
    expect(cache.get(USER, T0 + 1)).toEqual({ value: null })
  })

  it('does not let one member read another member\'s state', () => {
    cache.set(USER, SUSPENDED, T0)
    expect(cache.get('user-2', T0)).toBeNull()
  })

  it('refreshes the window when the same member is stored again', () => {
    cache.set(USER, ACTIVE, T0)
    cache.set(USER, ACTIVE, T0 + 4_000)
    expect(cache.get(USER, T0 + 6_000)).toEqual({ value: ACTIVE })
  })

  it('stays bounded when entries are all expired', () => {
    for (let i = 0; i <= ACCOUNT_STATE_MAX_ENTRIES; i++) cache.set(`u${i}`, ACTIVE, T0)
    // Everything above was written at T0, so a later write finds it all expired.
    cache.set('later', ACTIVE, T0 + ACCOUNT_STATE_TTL_MS + 1)
    expect(cache.get('u0', T0 + ACCOUNT_STATE_TTL_MS + 1)).toBeNull()
    expect(cache.get('later', T0 + ACCOUNT_STATE_TTL_MS + 2)).toEqual({ value: ACTIVE })
  })

  it('stays bounded when every entry is still live', () => {
    // Nothing is expired here, so the sweep cannot reclaim anything and the cap has
    // to be held by dropping the oldest insertions instead.
    for (let i = 0; i < ACCOUNT_STATE_MAX_ENTRIES + 500; i++) cache.set(`u${i}`, ACTIVE, T0)
    const newest = `u${ACCOUNT_STATE_MAX_ENTRIES + 499}`
    expect(cache.get(newest, T0 + 1)).toEqual({ value: ACTIVE })
    expect(cache.get('u0', T0 + 1)).toBeNull()
  })
})
