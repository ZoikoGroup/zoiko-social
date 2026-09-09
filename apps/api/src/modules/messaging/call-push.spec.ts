import { NotFoundException } from '@nestjs/common'
import { MessagingService } from './messaging.service'

/**
 * Device notifications for calls.
 *
 * The regression this locks down: a call record was published to the conversation
 * room and nowhere else. That reaches whoever already has the thread open and no
 * one else, so a member whose app was closed missed the call and then heard
 * nothing about it — the exact case push exists for.
 *
 * Only a missed call is worth announcing. A call that connected was witnessed by
 * both parties, and a declined one was declined by the very person who would be
 * notified.
 */

const CALLER = 'caller-1'
const RECIPIENT = 'recipient-1'
const CONVO = 'convo-1'

function build(opts: { muted?: boolean } = {}) {
  const prisma = {
    conversationMember: {
      findFirst: jest.fn().mockResolvedValue({ userId: CALLER }),
      findUnique: jest.fn().mockResolvedValue({ isDeleted: false }),
      findMany: jest.fn().mockResolvedValue([{ userId: RECIPIENT }]),
    },
    conversationSetting: {
      findMany: jest.fn().mockResolvedValue(opts.muted ? [{ userId: RECIPIENT }] : []),
    },
    message: {
      create: jest.fn().mockResolvedValue({
        id: 'msg-1',
        createdAt: new Date('2026-08-22T10:00:00Z'),
        sender: { id: CALLER, username: 'caller', displayName: 'The Caller', avatarUrl: null },
      }),
    },
    conversation: { update: jest.fn().mockResolvedValue({}) },
  }

  const sendToUser = jest.fn().mockResolvedValue({ sent: 1, pruned: 0 })
  const allowsPush = jest.fn().mockResolvedValue(true)

  const service = new MessagingService(
    prisma as never,
    {} as never,
    { publish: jest.fn().mockResolvedValue(undefined), publishToUser: jest.fn() } as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    { sendToUser } as never,
    { allowsPush } as never,
    // communityChat: these specs are all DM/group, where the derived
    // community check is never the thing that grants access.
    {
      assertCanRead: jest.fn().mockRejectedValue(
        new NotFoundException({ code: 'CONVERSATION_NOT_FOUND', message: 'Conversation not found' }),
      ),
      assertCanPost: jest.fn().mockRejectedValue(
        new NotFoundException({ code: 'CONVERSATION_NOT_FOUND', message: 'Conversation not found' }),
      ),
      isChatMember: jest.fn().mockResolvedValue(false),
      markRead: jest.fn().mockResolvedValue(undefined),
    } as never,
  )
  ;(service as unknown as { logger: unknown }).logger = { warn: jest.fn(), debug: jest.fn(), log: jest.fn() }
  return { service, sendToUser, allowsPush, prisma }
}

const record = (service: MessagingService, status: 'missed' | 'ended' | 'declined') =>
  service.recordCallMessage(CALLER, CONVO, { kind: 'audio', status, durationSec: 65 })

describe('call push', () => {
  it('notifies the device about a missed call', async () => {
    const { service, sendToUser } = build()
    await record(service, 'missed')
    expect(sendToUser).toHaveBeenCalledWith(
      RECIPIENT,
      expect.objectContaining({
        title: 'The Caller',
        type: 'call',
        url: `/messages?conversation=${CONVO}`,
      }),
    )
  })

  it('carries the call wording as the body', async () => {
    const { service, sendToUser } = build()
    await record(service, 'missed')
    expect(sendToUser.mock.calls[0][1].body).toContain('Missed voice call')
  })

  it.each(['ended', 'declined'] as const)('stays quiet for a %s call', async (status) => {
    const { service, sendToUser } = build()
    await record(service, status)
    expect(sendToUser).not.toHaveBeenCalled()
  })

  it('respects a muted conversation', async () => {
    const { service, sendToUser } = build({ muted: true })
    await record(service, 'missed')
    expect(sendToUser).not.toHaveBeenCalled()
  })

  it('respects the Messages category being switched off', async () => {
    const { service, sendToUser, allowsPush } = build()
    allowsPush.mockResolvedValue(false)
    await record(service, 'missed')
    expect(sendToUser).not.toHaveBeenCalled()
  })

  it('never notifies the caller about their own call', async () => {
    const { service, prisma } = build()
    await record(service, 'missed')
    expect(prisma.conversationMember.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ userId: { not: CALLER } }),
      }),
    )
  })
})
