import { NotFoundException, ForbiddenException } from '@nestjs/common'
import { CommunityChatService } from './community-chat.service'

/**
 * Authorization on community chat.
 *
 * This is the shape of code that went wrong last week: a new endpoint keyed on
 * something other than the caller's own id, tested for whether it worked rather
 * than for who was allowed to use it. So the "someone else's row" cases are
 * written first here, before any of the happy paths.
 *
 * The one that matters most is a non-member of a PRIVATE community. Answering
 * "forbidden" would confirm the chat exists, and with it that the community
 * exists and has members — to anyone who can guess a conversation id. Every
 * refusal below must be indistinguishable from "no such conversation".
 */

const CONVO = 'conversation-1'
const COMMUNITY = 'community-1'
const ME = 'user-me'
const MESSAGE = 'message-1'

type MemberRow = { role: string; status: string; mutedUntil: Date | null } | null

function build(opts: {
  member?: MemberRow
  chatEnabled?: boolean
  announcementOnly?: boolean
  slowModeSeconds?: number
  /** How long ago this member last posted, in seconds. undefined = never. */
  lastPostSecondsAgo?: number
  conversation?: 'community' | 'dm' | 'missing'
  communityDeleted?: boolean
} = {}) {
  const {
    member = { role: 'member', status: 'active', mutedUntil: null },
    chatEnabled = true,
    announcementOnly = false,
    slowModeSeconds = 0,
    lastPostSecondsAgo,
    conversation = 'community',
    communityDeleted = false,
  } = opts

  const conversationRow =
    conversation === 'missing'
      ? null
      : conversation === 'dm'
        ? { id: CONVO, communityId: null, isDeleted: false, community: null }
        : {
            id: CONVO,
            communityId: COMMUNITY,
            isDeleted: false,
            community: {
              id: COMMUNITY,
              isDeleted: communityDeleted,
              settings: {
                chatEnabled,
                chatAnnouncementOnly: announcementOnly,
                chatSlowModeSeconds: slowModeSeconds,
              },
            },
          }

  const prisma = {
    conversation: {
      findUnique: jest.fn().mockResolvedValue(conversationRow),
      upsert: jest.fn().mockResolvedValue({ id: CONVO }),
    },
    communityMember: {
      findUnique: jest.fn().mockResolvedValue(member),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      findMany: jest.fn().mockResolvedValue([]),
    },
    message: {
      findFirst: jest.fn().mockResolvedValue(
        lastPostSecondsAgo === undefined
          ? null
          : { createdAt: new Date(Date.now() - lastPostSecondsAgo * 1000) },
      ),
      findUnique: jest.fn().mockResolvedValue({
        id: MESSAGE,
        conversationId: CONVO,
        senderId: 'someone-else',
        isDeleted: false,
        pinnedAt: null,
      }),
      update: jest.fn().mockResolvedValue({}),
      updateMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    communitySettings: {
      upsert: jest.fn().mockResolvedValue({
        chatEnabled: true,
        chatAnnouncementOnly: true,
        chatSlowModeSeconds: 0,
      }),
    },
    $transaction: jest.fn().mockResolvedValue([]),
  }
  const realtime = { publish: jest.fn().mockResolvedValue(undefined) }
  const service = new CommunityChatService(prisma as never, realtime as never)
  return { service, prisma, realtime }
}

describe('community chat — who can read it at all', () => {
  it('refuses someone who is not a member, and does not admit the chat exists', async () => {
    const { service } = build({ member: null })
    await expect(service.assertCanRead(ME, CONVO)).rejects.toBeInstanceOf(NotFoundException)
  })

  it('refuses a member who was banned, with the same answer as a stranger', async () => {
    const { service } = build({ member: { role: 'member', status: 'banned', mutedUntil: null } })
    await expect(service.assertCanRead(ME, CONVO)).rejects.toBeInstanceOf(NotFoundException)
  })

  it('refuses a member whose join is still pending', async () => {
    const { service } = build({ member: { role: 'member', status: 'pending', mutedUntil: null } })
    await expect(service.assertCanRead(ME, CONVO)).rejects.toBeInstanceOf(NotFoundException)
  })

  it('refuses everyone once the community is deleted', async () => {
    const { service } = build({
      communityDeleted: true,
      member: { role: 'owner', status: 'active', mutedUntil: null },
    })
    await expect(service.assertCanRead(ME, CONVO)).rejects.toBeInstanceOf(NotFoundException)
  })

  it('never checks membership for a chat that is not a community chat', async () => {
    // getAccess returns null so the caller falls through to the DM/group check;
    // it must not decide a DM is readable.
    const { service, prisma } = build({ conversation: 'dm' })
    await expect(service.getAccess(ME, CONVO)).resolves.toBeNull()
    expect(prisma.communityMember.findUnique).not.toHaveBeenCalled()
  })

  it('lets an ordinary active member in', async () => {
    const { service } = build()
    const access = await service.assertCanRead(ME, CONVO)
    expect(access.canPost).toBe(true)
    expect(access.isMod).toBe(false)
  })
})

describe('community chat — who can post', () => {
  it('stops a member posting in announcement mode, and says why', async () => {
    const { service } = build({ announcementOnly: true })
    const access = await service.getAccess(ME, CONVO)
    expect(access?.canPost).toBe(false)
    expect(access?.reason).toBe('announcement_only')
    await expect(service.assertCanPost(ME, CONVO)).rejects.toBeInstanceOf(ForbiddenException)
  })

  it.each(['owner', 'admin', 'moderator'])('still lets a %s post in announcement mode', async (role) => {
    const { service } = build({
      announcementOnly: true,
      member: { role, status: 'active', mutedUntil: null },
    })
    await expect(service.assertCanPost(ME, CONVO)).resolves.toMatchObject({ canPost: true })
  })

  it('stops a muted member', async () => {
    const { service } = build({
      member: { role: 'member', status: 'active', mutedUntil: new Date(Date.now() + 60_000) },
    })
    const access = await service.getAccess(ME, CONVO)
    expect(access?.reason).toBe('muted')
  })

  it('lets a member post once the mute has expired', async () => {
    const { service } = build({
      member: { role: 'member', status: 'active', mutedUntil: new Date(Date.now() - 1000) },
    })
    await expect(service.assertCanPost(ME, CONVO)).resolves.toMatchObject({ canPost: true })
  })

  it('holds a member to slow mode and reports the wait', async () => {
    const { service } = build({ slowModeSeconds: 30, lastPostSecondsAgo: 10 })
    const access = await service.getAccess(ME, CONVO)
    expect(access?.reason).toBe('slow_mode')
    expect(access?.retryAfterSeconds).toBe(20)
  })

  it('lets them post once the slow-mode window has passed', async () => {
    const { service } = build({ slowModeSeconds: 30, lastPostSecondsAgo: 31 })
    await expect(service.assertCanPost(ME, CONVO)).resolves.toMatchObject({ canPost: true })
  })

  it('does not apply slow mode to a moderator', async () => {
    const { service } = build({
      slowModeSeconds: 30,
      lastPostSecondsAgo: 1,
      member: { role: 'moderator', status: 'active', mutedUntil: null },
    })
    await expect(service.assertCanPost(ME, CONVO)).resolves.toMatchObject({ canPost: true })
  })

  it('does not apply slow mode to someone who has never posted', async () => {
    const { service } = build({ slowModeSeconds: 30 })
    await expect(service.assertCanPost(ME, CONVO)).resolves.toMatchObject({ canPost: true })
  })

  it('locks the room for members when chat is switched off, but not for an admin', async () => {
    const off = build({ chatEnabled: false })
    expect((await off.service.getAccess(ME, CONVO))?.reason).toBe('chat_disabled')

    const admin = build({
      chatEnabled: false,
      member: { role: 'admin', status: 'active', mutedUntil: null },
    })
    await expect(admin.service.assertCanPost(ME, CONVO)).resolves.toMatchObject({ canPost: true })
  })

  it('reports the reason a member cannot fix ahead of one they can', async () => {
    // Announcement mode and slow mode both apply. Telling someone to wait 20s
    // when they may never post is worse than useless.
    const { service } = build({ announcementOnly: true, slowModeSeconds: 30, lastPostSecondsAgo: 10 })
    expect((await service.getAccess(ME, CONVO))?.reason).toBe('announcement_only')
  })

  it('treats a community with no settings row as an open chat', async () => {
    const { service, prisma } = build()
    prisma.conversation.findUnique.mockResolvedValue({
      id: CONVO,
      communityId: COMMUNITY,
      isDeleted: false,
      community: { id: COMMUNITY, isDeleted: false, settings: null },
    })
    await expect(service.assertCanPost(ME, CONVO)).resolves.toMatchObject({ canPost: true })
  })
})

describe('community chat — moderator powers', () => {
  it('refuses an ordinary member pinning a message', async () => {
    const { service, prisma } = build()
    await expect(service.pinMessage(ME, MESSAGE)).rejects.toBeInstanceOf(ForbiddenException)
    expect(prisma.$transaction).not.toHaveBeenCalled()
  })

  it('lets a moderator pin, and clears any previous pin in the same transaction', async () => {
    const { service, prisma } = build({
      member: { role: 'moderator', status: 'active', mutedUntil: null },
    })
    await expect(service.pinMessage(ME, MESSAGE)).resolves.toEqual({ pinned: true })
    expect(prisma.$transaction).toHaveBeenCalled()
  })

  it('refuses an ordinary member removing someone else\'s message', async () => {
    const { service, prisma } = build()
    await expect(service.moderateDelete(ME, MESSAGE)).rejects.toBeInstanceOf(ForbiddenException)
    expect(prisma.message.update).not.toHaveBeenCalled()
  })

  it('refuses a non-member of the community outright, not merely as a non-moderator', async () => {
    const { service } = build({ member: null })
    await expect(service.moderateDelete(ME, MESSAGE)).rejects.toBeInstanceOf(NotFoundException)
  })

  it('lets a moderator remove a message for everyone', async () => {
    const { service, prisma } = build({
      member: { role: 'moderator', status: 'active', mutedUntil: null },
    })
    await service.moderateDelete(ME, MESSAGE)
    expect(prisma.message.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ deletedForEveryone: true }) }),
    )
  })
})

describe('community chat — settings', () => {
  it.each(['member', 'moderator'])('refuses a %s changing chat settings', async (role) => {
    // Moderation and configuration are deliberately different levels: a
    // moderator can remove a message but cannot silence the whole room.
    const { service, prisma } = build({ member: { role, status: 'active', mutedUntil: null } })
    await expect(
      service.updateSettings(ME, CONVO, { announcementOnly: true }),
    ).rejects.toBeInstanceOf(ForbiddenException)
    expect(prisma.communitySettings.upsert).not.toHaveBeenCalled()
  })

  it.each(['owner', 'admin'])('lets a %s change them', async (role) => {
    const { service, prisma } = build({ member: { role, status: 'active', mutedUntil: null } })
    await expect(service.updateSettings(ME, CONVO, { announcementOnly: true })).resolves.toMatchObject({
      announcementOnly: true,
    })
    expect(prisma.communitySettings.upsert).toHaveBeenCalled()
  })

  it('creates the settings row when the community has none', async () => {
    const { service, prisma } = build({ member: { role: 'owner', status: 'active', mutedUntil: null } })
    await service.updateSettings(ME, CONVO, { slowModeSeconds: 15 })
    expect(prisma.communitySettings.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ create: expect.objectContaining({ communityId: COMMUNITY }) }),
    )
  })

  it('sends only the fields it was given, so two admins do not overwrite each other', async () => {
    const { service, prisma } = build({ member: { role: 'owner', status: 'active', mutedUntil: null } })
    await service.updateSettings(ME, CONVO, { slowModeSeconds: 15 })
    const call = prisma.communitySettings.upsert.mock.calls[0][0] as { update: Record<string, unknown> }
    expect(call.update).toEqual({ chatSlowModeSeconds: 15 })
  })

  it('tells the room, so an open composer locks itself rather than lying until reload', async () => {
    const { service, realtime } = build({ member: { role: 'owner', status: 'active', mutedUntil: null } })
    await service.updateSettings(ME, CONVO, { announcementOnly: true })
    expect(realtime.publish).toHaveBeenCalledWith(
      `conversation:${CONVO}`,
      'community:settings',
      expect.objectContaining({ announcementOnly: true }),
    )
  })
})

describe('community chat — the gateway membership test', () => {
  it('answers false rather than throwing, so a socket join is refused quietly', async () => {
    const { service } = build({ member: null })
    await expect(service.isChatMember(ME, CONVO)).resolves.toBe(false)
  })

  it('answers false for a conversation that is not a community chat', async () => {
    const { service } = build({ conversation: 'dm' })
    await expect(service.isChatMember(ME, CONVO)).resolves.toBe(false)
  })

  it('answers true for an active member, including one who may not post', async () => {
    const { service } = build({ announcementOnly: true })
    await expect(service.isChatMember(ME, CONVO)).resolves.toBe(true)
  })
})
