import { MessagingService } from './messaging.service'
import { aiThreadHint } from './ai-thread-hint'

/**
 * Provisioning the assistant thread on inbox load.
 *
 * The regression these lock down: deleting the conversation soft-deletes the
 * member's own row, and the inbox lists only live rows — but this check asked
 * whether a conversation existed *at all*, which it still did. So it reported
 * "already provisioned" and returned, and the member lost the assistant with no
 * way to get it back. A second conversation is not the answer either: the pair
 * already have a thread and a new one would split the history in two.
 */

const USER = 'user-1'
const AI = 'ai-profile'
const CONVO = 'convo-1'

function build(existing: { id: string; members: { isDeleted: boolean }[] } | null) {
  const prisma = {
    conversation: {
      findFirst: jest.fn().mockResolvedValue(existing),
      create: jest.fn().mockResolvedValue({ id: 'new-convo' }),
    },
    conversationMember: { update: jest.fn().mockResolvedValue({}) },
  }
  const service = new MessagingService(
    prisma as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    { getAiProfileId: () => AI, greeting: 'Hello' } as never,
    { sendToUser: jest.fn() } as never,
    { allowsPush: jest.fn().mockResolvedValue(true) } as never,
  )
  // The create path ends in sendMessage, which is out of scope here; stub it so
  // these tests are about provisioning and nothing else.
  ;(service as unknown as { sendMessage: unknown }).sendMessage = jest.fn().mockResolvedValue({})
  ;(service as unknown as { logger: unknown }).logger = { warn: jest.fn(), log: jest.fn() }
  return { service, prisma }
}

const ensure = (service: MessagingService, userId = USER) =>
  (service as unknown as { ensureAiThread: (id: string) => Promise<void> }).ensureAiThread(userId)

describe('ensureAiThread', () => {
  beforeEach(() => aiThreadHint.forget(USER))

  it('leaves a live thread alone', async () => {
    const { service, prisma } = build({ id: CONVO, members: [{ isDeleted: false }] })
    await ensure(service)
    expect(prisma.conversationMember.update).not.toHaveBeenCalled()
    expect(prisma.conversation.create).not.toHaveBeenCalled()
  })

  it('restores the member row after the conversation was deleted', async () => {
    const { service, prisma } = build({ id: CONVO, members: [{ isDeleted: true }] })
    await ensure(service)
    expect(prisma.conversationMember.update).toHaveBeenCalledWith({
      where: { conversationId_userId: { conversationId: CONVO, userId: USER } },
      data: { isDeleted: false, deletedAt: null },
    })
    // Restored, not duplicated — the history stays in one thread.
    expect(prisma.conversation.create).not.toHaveBeenCalled()
  })

  it('creates a thread for a member who has never had one', async () => {
    const { service, prisma } = build(null)
    await ensure(service)
    expect(prisma.conversation.create).toHaveBeenCalled()
    expect(prisma.conversationMember.update).not.toHaveBeenCalled()
  })

  it('does not look twice for the same member', async () => {
    const { service, prisma } = build({ id: CONVO, members: [{ isDeleted: false }] })
    await ensure(service)
    await ensure(service)
    expect(prisma.conversation.findFirst).toHaveBeenCalledTimes(1)
  })

  it('looks again once the member deletes a conversation', async () => {
    const { service, prisma } = build({ id: CONVO, members: [{ isDeleted: false }] })
    await ensure(service)
    // What ContactService.deleteConversation does — the cached answer is now stale.
    aiThreadHint.forget(USER)
    await ensure(service)
    expect(prisma.conversation.findFirst).toHaveBeenCalledTimes(2)
  })

  it('does nothing when the assistant is not provisioned', async () => {
    const { service, prisma } = build(null)
    ;(service as unknown as { aiAssistant: unknown }).aiAssistant = { getAiProfileId: () => null }
    await ensure(service)
    expect(prisma.conversation.findFirst).not.toHaveBeenCalled()
  })
})
