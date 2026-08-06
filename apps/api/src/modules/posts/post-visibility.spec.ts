import { NotFoundException } from '@nestjs/common'
import { PostsService } from './posts.service'

/**
 * Account-state gating on the post-visibility helpers.
 *
 * The regression these lock down: assertCanViewAuthor only checked
 * `state === 'active'` on the branch where it looked the author up itself.
 * Callers that already had the author in hand passed `isPrivate` alone and
 * skipped the check entirely — so deactivating or banning an account removed it
 * from the feed, search and the profile grid, but left every one of its posts
 * readable by direct id at GET /posts/:id.
 */

const AUTHOR = 'author-1'
const VIEWER = 'viewer-1'

function build() {
  const prisma = {
    blockedUser: { findFirst: jest.fn().mockResolvedValue(null) },
    profile: { findUnique: jest.fn().mockResolvedValue({ isPrivate: false, state: 'active' }) },
    follow: { findUnique: jest.fn().mockResolvedValue({ status: 'active' }) },
    communityMember: { findUnique: jest.fn().mockResolvedValue({ status: 'active' }) },
  }
  // Only prisma is touched by these two helpers; the rest are constructor
  // dependencies the visibility path never reaches.
  const service = new PostsService(
    prisma as never, // prisma
    {} as never,     // redis
    {} as never,     // realtime
    {} as never,     // notifications
    {} as never,     // feedFanout
    {} as never,     // profanity
    {} as never,     // affinity
  )
  return { service, prisma }
}

function post(author: { isPrivate: boolean; state: string }, overrides: Record<string, unknown> = {}) {
  return { authorId: AUTHOR, isDeleted: false, visibility: 'public', communityId: null, author, ...overrides }
}

describe('post visibility — account state', () => {
  describe('assertCanViewAuthor', () => {
    it('rejects a known-deactivated author without needing a lookup', async () => {
      const { service, prisma } = build()

      await expect(
        service.assertCanViewAuthor(AUTHOR, VIEWER, { isPrivate: false, state: 'deactivated' }),
      ).rejects.toBeInstanceOf(NotFoundException)

      // The whole point of passing the author in is to avoid the round-trip;
      // the gate must not depend on that round-trip happening.
      expect(prisma.profile.findUnique).not.toHaveBeenCalled()
    })

    it('rejects known-banned and known-suspended authors too', async () => {
      for (const state of ['banned', 'suspended', 'pending_deletion']) {
        const { service } = build()
        await expect(
          service.assertCanViewAuthor(AUTHOR, VIEWER, { isPrivate: false, state }),
        ).rejects.toBeInstanceOf(NotFoundException)
      }
    })

    it('still allows a known-active public author', async () => {
      const { service } = build()
      await expect(
        service.assertCanViewAuthor(AUTHOR, VIEWER, { isPrivate: false, state: 'active' }),
      ).resolves.toBeUndefined()
    })

    it('falls back to a lookup when the author was not supplied, and still gates on state', async () => {
      const { service, prisma } = build()
      prisma.profile.findUnique.mockResolvedValue({ isPrivate: false, state: 'deactivated' })

      await expect(service.assertCanViewAuthor(AUTHOR, VIEWER)).rejects.toBeInstanceOf(NotFoundException)
      expect(prisma.profile.findUnique).toHaveBeenCalled()
    })

    it('lets an author see their own content whatever their state', async () => {
      const { service } = build()
      await expect(service.assertCanViewAuthor(AUTHOR, AUTHOR)).resolves.toBeUndefined()
    })
  })

  describe('assertCanViewPost', () => {
    it('hides a public post whose author has been deactivated', async () => {
      const { service } = build()
      await expect(
        service.assertCanViewPost(post({ isPrivate: false, state: 'deactivated' }), VIEWER),
      ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('hides a public post whose author has been banned', async () => {
      const { service } = build()
      await expect(
        service.assertCanViewPost(post({ isPrivate: false, state: 'banned' }), VIEWER),
      ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('hides it from anonymous visitors as well', async () => {
      const { service } = build()
      await expect(
        service.assertCanViewPost(post({ isPrivate: false, state: 'banned' })),
      ).rejects.toBeInstanceOf(NotFoundException)
    })

    it('still serves a public post from an active author', async () => {
      const { service } = build()
      await expect(
        service.assertCanViewPost(post({ isPrivate: false, state: 'active' }), VIEWER),
      ).resolves.toBeUndefined()
    })

    it('still lets the author read their own post after deactivating', async () => {
      const { service } = build()
      // Deactivation is reversible — signing back in restores the account, so
      // the owner must not be locked out of their own content meanwhile.
      await expect(
        service.assertCanViewPost(post({ isPrivate: false, state: 'deactivated' }), AUTHOR),
      ).resolves.toBeUndefined()
    })

    it('keeps enforcing per-post visibility for active authors', async () => {
      const { service, prisma } = build()
      prisma.follow.findUnique.mockResolvedValue(null)

      await expect(
        service.assertCanViewPost(
          post({ isPrivate: false, state: 'active' }, { visibility: 'followers' }),
          VIEWER,
        ),
      ).rejects.toBeInstanceOf(NotFoundException)
    })
  })
})
