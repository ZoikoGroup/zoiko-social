import { NotFoundException } from '@nestjs/common'
import { MessagingService } from './messaging.service'

/**
 * Authorization on markConversationRead.
 *
 * The regression these lock down: the receipt upsert keyed on `messageId` and
 * `userId` only, ignoring `conversationId` entirely and never checking
 * membership. Any authenticated caller could therefore write a `read` receipt
 * against any message id in the system — reachable from both
 * POST /messaging/conversations/:id/read and the `messages:read` socket event,
 * whose payloads are caller-controlled.
 */

const USER = 'user-1'
const CONVO = 'convo-1'
const MESSAGE = 'message-1'
/** A real message, but in a thread this caller has no part in. */
const FOREIGN_MESSAGE = 'message-in-someone-elses-thread'

function build(opts: { member?: boolean; messageInConvo?: boolean } = {}) {
  const { member = true, messageInConvo = true } = opts
  const prisma = {
    conversationMember: {
      findUnique: jest.fn().mockResolvedValue(member ? { isDeleted: false } : null),
      updateMany: jest.fn().mockResolvedValue({ count: member ? 1 : 0 }),
    },
    message: {
      findFirst: jest.fn().mockResolvedValue(messageInConvo ? { id: MESSAGE } : null),
    },
    messageReceipt: { upsert: jest.fn().mockResolvedValue({}) },
  }
  const service = new MessagingService(
    prisma as never, // prisma
    {} as never,     // redis
    {} as never,     // realtime
    {} as never,     // storage
    {} as never,     // privacy
    {} as never,     // presence
    {} as never,     // profanity
    {} as never,     // aiAssistant
      {} as never,     // push
      {} as never,     // pushPreferences
  )
  return { service, prisma }
}

describe('markConversationRead — authorization', () => {
  it('refuses a caller who is not a member, and writes no receipt', async () => {
    const { service, prisma } = build({ member: false })

    await expect(service.markConversationRead(USER, CONVO, MESSAGE)).rejects.toBeInstanceOf(NotFoundException)

    // The receipt write is the part that was exploitable — it must not happen.
    expect(prisma.messageReceipt.upsert).not.toHaveBeenCalled()
    expect(prisma.conversationMember.updateMany).not.toHaveBeenCalled()
  })

  it('refuses a member who points at a message from another conversation', async () => {
    const { service, prisma } = build({ messageInConvo: false })

    await expect(
      service.markConversationRead(USER, CONVO, FOREIGN_MESSAGE),
    ).rejects.toBeInstanceOf(NotFoundException)

    expect(prisma.messageReceipt.upsert).not.toHaveBeenCalled()
  })

  it('binds the message lookup to the conversation, not just the id', async () => {
    const { service, prisma } = build()

    await service.markConversationRead(USER, CONVO, MESSAGE)

    // A lookup by bare id would re-open the hole; the conversation must be in
    // the predicate.
    expect(prisma.message.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: MESSAGE, conversationId: CONVO } }),
    )
  })

  it('writes the receipt for a member reading their own conversation', async () => {
    const { service, prisma } = build()

    await expect(service.markConversationRead(USER, CONVO, MESSAGE)).resolves.toBeUndefined()

    expect(prisma.conversationMember.updateMany).toHaveBeenCalled()
    expect(prisma.messageReceipt.upsert).toHaveBeenCalledWith(
      expect.objectContaining({ where: { messageId_userId: { messageId: MESSAGE, userId: USER } } }),
    )
  })

  it('marks the conversation read with no message id, touching no receipt', async () => {
    const { service, prisma } = build()

    await expect(service.markConversationRead(USER, CONVO)).resolves.toBeUndefined()

    expect(prisma.conversationMember.updateMany).toHaveBeenCalled()
    expect(prisma.message.findFirst).not.toHaveBeenCalled()
    expect(prisma.messageReceipt.upsert).not.toHaveBeenCalled()
  })

  it('treats a soft-deleted membership as no membership', async () => {
    const { service, prisma } = build()
    prisma.conversationMember.findUnique.mockResolvedValue({ isDeleted: true })

    await expect(service.markConversationRead(USER, CONVO, MESSAGE)).rejects.toBeInstanceOf(NotFoundException)
    expect(prisma.messageReceipt.upsert).not.toHaveBeenCalled()
  })
})
