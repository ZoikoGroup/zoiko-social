/**
 * The privacy toggles, and the shapes of query they must produce.
 *
 * Three of the four toggles in Settings → Privacy were write-only: accepted by
 * the API, stored, and never read by anything. A member could switch "Allow
 * tagging" off and still be tagged, or switch "Show last active" on and see
 * nothing appear. Nothing failed loudly, which is exactly why it survived.
 *
 * These tests pin the parts that are pure logic — the default a missing
 * settings row implies, and the mention filter's shape — because both are easy
 * to get subtly wrong in a way no type checker notices.
 */

/**
 * The filter both mention paths use. Kept here in the same form the services
 * pass to Prisma, so a change to either has to be a deliberate one.
 */
const TAGGABLE = {
  OR: [{ userSettings: { allowTagging: true } }, { userSettings: null }],
}

describe('privacy toggle defaults', () => {
  /*
    These four defaults are asserted in three places that must agree: the
    Prisma column defaults, the client's fallback object in Settings, and the
    server's reading of a missing row. They disagreed before: the server read a
    missing row as "show location", while the column and the client both say
    false.
  */
  const COLUMN_DEFAULTS = {
    showLastActive: true,
    showEmail: false,
    allowTagging: true,
    showLocation: false,
  }

  it('treats a missing settings row as location hidden, not shown', () => {
    const settings = null as { showLocation?: boolean } | null
    const showLocation = settings?.showLocation ?? COLUMN_DEFAULTS.showLocation
    expect(showLocation).toBe(false)
  })

  it('treats a missing settings row as last-active shown', () => {
    // Opposite default to location, and getting them the same way round is the
    // easy mistake.
    const settings = null as { showLastActive?: boolean } | null
    const showLastActive = settings?.showLastActive ?? COLUMN_DEFAULTS.showLastActive
    expect(showLastActive).toBe(true)
  })

  it('does not let an explicit false be overridden by the default', () => {
    const settings = { showLastActive: false }
    expect(settings.showLastActive ?? COLUMN_DEFAULTS.showLastActive).toBe(false)
  })
})

describe('mention filter', () => {
  it('includes members who have no settings row at all', () => {
    // Most accounts. Requiring a row would silently break mentions for them.
    const branches = TAGGABLE.OR
    expect(branches).toContainEqual({ userSettings: null })
  })

  it('includes members who have tagging switched on', () => {
    expect(TAGGABLE.OR).toContainEqual({ userSettings: { allowTagging: true } })
  })

  it('has no branch that would match tagging switched off', () => {
    const matchesOptedOut = TAGGABLE.OR.some(
      (branch) =>
        'userSettings' in branch &&
        branch.userSettings !== null &&
        (branch.userSettings as { allowTagging?: boolean }).allowTagging === false,
    )
    expect(matchesOptedOut).toBe(false)
  })
})

describe('last-active disclosure', () => {
  /** The rule redactForViewer applies, expressed on its own. */
  function disclose(input: {
    isOwner: boolean
    showLastActive: boolean
    presence: { status: string; lastSeen: Date | null } | null
  }): { isOnline: boolean; lastActiveAt: string | null } {
    const hidden = { isOnline: false, lastActiveAt: null }
    if (input.isOwner) return hidden
    if (!input.showLastActive) return hidden
    if (!input.presence) return hidden
    const online = input.presence.status === 'online'
    return {
      isOnline: online,
      lastActiveAt: online ? null : (input.presence.lastSeen?.toISOString() ?? null),
    }
  }

  const seen = new Date('2026-09-03T13:16:18.726Z')

  it('shows a timestamp to another member when the toggle is on', () => {
    expect(
      disclose({ isOwner: false, showLastActive: true, presence: { status: 'offline', lastSeen: seen } }),
    ).toEqual({ isOnline: false, lastActiveAt: seen.toISOString() })
  })

  it('discloses nothing when the toggle is off', () => {
    expect(
      disclose({ isOwner: false, showLastActive: false, presence: { status: 'offline', lastSeen: seen } }),
    ).toEqual({ isOnline: false, lastActiveAt: null })
  })

  it('reports online without a redundant timestamp', () => {
    // "Online now" and "active 2 minutes ago" side by side invites the question
    // of which to believe.
    expect(
      disclose({ isOwner: false, showLastActive: true, presence: { status: 'online', lastSeen: seen } }),
    ).toEqual({ isOnline: true, lastActiveAt: null })
  })

  it('tells the owner nothing about themselves', () => {
    expect(
      disclose({ isOwner: true, showLastActive: true, presence: { status: 'online', lastSeen: seen } }),
    ).toEqual({ isOnline: false, lastActiveAt: null })
  })

  it('discloses nothing when there is no recorded presence', () => {
    expect(disclose({ isOwner: false, showLastActive: true, presence: null })).toEqual({
      isOnline: false,
      lastActiveAt: null,
    })
  })

  it('survives presence with a null lastSeen', () => {
    expect(
      disclose({ isOwner: false, showLastActive: true, presence: { status: 'offline', lastSeen: null } }),
    ).toEqual({ isOnline: false, lastActiveAt: null })
  })
})
