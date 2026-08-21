import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { PUSH_CATEGORY, PUSH_PREFERENCE_KEYS, pushCategoryFor } from './push-categories'
import { PREFERENCE_KEYS } from '../comms/comms.types'

/**
 * Coverage, enforced against the source rather than against a list someone
 * remembered to update.
 *
 * The bug this locks down: sixteen of the app's notification types had no entry
 * in the comms registry, because that registry is an email template estate and no
 * email template exists for them. Push gated on the registry, so those sixteen —
 * breeding requests, order updates, pet-care bookings among them — reached
 * people's phones with no category to switch off. The only control was "all push,
 * or none".
 *
 * So this walks the modules, finds every type the app actually enqueues, and
 * fails if one has no push category. Adding a producer without a category breaks
 * the build instead of shipping a notification nobody can turn off.
 */

const MODULES = join(__dirname, '..')

/** Every `type: '...'` that appears near an `enqueue(` call. */
function enqueuedTypes(): string[] {
  const found = new Set<string>()

  const walk = (dir: string): void => {
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry)
      if (statSync(full).isDirectory()) {
        walk(full)
        continue
      }
      if (!entry.endsWith('.ts') || entry.endsWith('.spec.ts')) continue

      const src = readFileSync(full, 'utf8')
      if (!src.includes('.enqueue(')) continue

      // The producers all build a job literal; the type is the field that
      // decides which notification it is.
      for (const call of src.split('.enqueue(').slice(1)) {
        const window = call.slice(0, 600)
        const match = /type:\s*'([a-z_]+)'/.exec(window)
        if (match) found.add(match[1])
      }
    }
  }

  walk(MODULES)
  return [...found].sort()
}

describe('push categories', () => {
  const types = enqueuedTypes()

  it('finds the producers at all', () => {
    // Guards the test itself: a refactor that moved enqueue calls would otherwise
    // make this suite pass by finding nothing.
    expect(types.length).toBeGreaterThan(20)
  })

  it('gives every enqueued notification type a category', () => {
    const uncontrollable = types.filter((t) => !pushCategoryFor(t))
    expect(uncontrollable).toEqual([])
  })

  it('offers a switch for every category it maps to', () => {
    const offered = new Set<string>(PUSH_PREFERENCE_KEYS)
    const mappedButUnswitchable = [...new Set(Object.values(PUSH_CATEGORY))].filter(
      (key) => !offered.has(key),
    )
    expect(mappedButUnswitchable).toEqual([])
  })

  it('offers no switch that nothing maps to', () => {
    // An empty category is a control that appears to do something and does not.
    const used = new Set<string>(Object.values(PUSH_CATEGORY))
    expect(PUSH_PREFERENCE_KEYS.filter((key) => !used.has(key))).toEqual([])
  })

  it('never offers a switch for notices that must not be silenceable', () => {
    const essential = [
      PREFERENCE_KEYS.accountEssential,
      PREFERENCE_KEYS.securityEssential,
      PREFERENCE_KEYS.safetyEssential,
      PREFERENCE_KEYS.privacyEssential,
      PREFERENCE_KEYS.billingEssential,
    ]
    for (const key of essential) {
      expect(PUSH_PREFERENCE_KEYS).not.toContain(key)
      expect(Object.values(PUSH_CATEGORY)).not.toContain(key)
    }
  })

  it('puts a community role change under communities, not events', () => {
    // Where it sits in the email registry, which reads as a copy-paste.
    expect(pushCategoryFor('community_role_changed')).toBe(PREFERENCE_KEYS.groupsActivity)
  })

  it('separates sharing from reactions', () => {
    expect(pushCategoryFor('post_shared')).toBe(PREFERENCE_KEYS.socialShares)
    expect(pushCategoryFor('new_like')).toBe(PREFERENCE_KEYS.socialReactions)
  })

  it('returns nothing for a type it does not know', () => {
    expect(pushCategoryFor('security_alert')).toBeUndefined()
  })
})
