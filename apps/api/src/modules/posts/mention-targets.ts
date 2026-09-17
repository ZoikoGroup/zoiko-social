import type { Prisma } from '@prisma/client'

/**
 * Who may be tagged.
 *
 * One definition, used by everything that touches a mention: the lookup that
 * turns `@handle` into a mention row on a post, the same lookup for a comment,
 * and the search behind the composer's picker.
 *
 * They have to agree. A picker offering someone the resolver will silently drop
 * is worse than no picker at all — the author watches the name appear, chooses
 * it, publishes, and nobody is tagged or notified. It also quietly discloses
 * the opposite of what the setting promises, by listing a member who asked not
 * to be taggable. Keeping the rule in one place is what stops those two copies
 * drifting apart later.
 *
 * `userSettings: null` is deliberate. The column defaults to true and a member
 * who has never opened settings has no row at all, so requiring one would stop
 * mentions working for most accounts.
 *
 * @param excludeIds accounts to leave out regardless — always the author, and
 *   for a comment the post's author too, since they are notified as the owner
 *   of the thread rather than as a mention.
 */
export function taggableWhere(excludeIds: string[]): Prisma.ProfileWhereInput {
  return {
    state: 'active',
    id: { notIn: excludeIds },
    OR: [
      { userSettings: { allowTagging: true } },
      { userSettings: null },
    ],
  }
}
