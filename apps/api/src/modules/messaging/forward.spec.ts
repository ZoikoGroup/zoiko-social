import { NotFoundException, BadRequestException } from '@nestjs/common'
import { MessagingService } from './messaging.service'

/**
 * Authorization on forwarding.
 *
 * Forwarding is the feature someone reaches for to get a message somewhere they
 * are not allowed to post, or to read one out of a conversation they are not in.
 * Both directions need checking, so both are written here before any test that
 * a forward actually arrives.
 *
 * The implementation deliberately goes through sendMessage for each target,
 * which is where membership, blocks and community posting rules already live.
 * These tests lock in that it does — a future refactor that inserts rows
 * directly would pass a "did it forward" test and quietly lose every check.
 */

const ME = 'user-me'
const SOURCE_CONVO = 'convo-source'
const TARGET_CONVO = 'convo-target'
const MESSAGE = 'message-1'

function build(opts: { readsSource?: boolean; message?: object | null } = {}) {
  const { readsSource = true, message } = opts

  const prisma = {
    message: {
      findUnique: jest.fn().mockResolvedValue(
        message === undefined
          ? {
              id: MESSAGE,
              conversationId: SOURCE_CONVO,
              isDeleted: false,
              type: 'text',
              body: 'hello',
              mediaUrls: [],
              metadata: null,
              poll: null,
            }
          : message,
      ),
    },
    conversationMember: {
      findUnique: jest.fn().mockResolvedValue(readsSource ? { isDeleted: false } : null),
    },
  }

  const communityChat = {
    assertCanRead: jest.fn().mockRejectedValue(
      new NotFoundException({ code: 'CONVERSATION_NOT_FOUND', message: 'Conversation not found' }),
    ),
  }

  const service = new MessagingService(
    prisma as never, {} as never, {} as never, {} as never, {} as never,
    {} as never, {} as never, {} as never, {} as never, {} as never,
    communityChat as never,
  )

  // Every target goes through sendMessage, so that is what gets spied on.
  const sendMessage = jest.fn().mockResolvedValue({ id: 'new-message' })
  ;(service as unknown as { sendMessage: unknown }).sendMessage = sendMessage

  return { service, prisma, communityChat, sendMessage }
}

describe('forwarding — what the caller must be allowed to do', () => {
  it('refuses to forward a message the caller cannot read', async () => {
    const { service, sendMessage } = build({ readsSource: false })
    await expect(service.forwardMessage(ME, MESSAGE, [TARGET_CONVO])).rejects.toBeInstanceOf(
      NotFoundException,
    )
    // The important half: nothing was written anywhere.
    expect(sendMessage).not.toHaveBeenCalled()
  })

  it('falls back to the community check when there is no member row', async () => {
    // A community chat has no ConversationMember rows by design, so a null here
    // must not mean "refuse" — it means "ask the derived check".
    const { service, communityChat } = build({ readsSource: false })
    await expect(service.forwardMessage(ME, MESSAGE, [TARGET_CONVO])).rejects.toBeInstanceOf(
      NotFoundException,
    )
    expect(communityChat.assertCanRead).toHaveBeenCalledWith(ME, SOURCE_CONVO)
  })

  it('refuses a message that does not exist', async () => {
    const { service } = build({ message: null })
    await expect(service.forwardMessage(ME, MESSAGE, [TARGET_CONVO])).rejects.toBeInstanceOf(
      NotFoundException,
    )
  })

  it('refuses a deleted message rather than resurrecting it elsewhere', async () => {
    const { service } = build({
      message: { id: MESSAGE, conversationId: SOURCE_CONVO, isDeleted: true, type: 'text', body: 'x', mediaUrls: [], metadata: null, poll: null },
    })
    await expect(service.forwardMessage(ME, MESSAGE, [TARGET_CONVO])).rejects.toBeInstanceOf(
      NotFoundException,
    )
  })

  it('sends each target through sendMessage, so its rules still apply', async () => {
    const { service, sendMessage } = build()
    await service.forwardMessage(ME, MESSAGE, [TARGET_CONVO, 'convo-other'])
    expect(sendMessage).toHaveBeenCalledTimes(2)
    expect(sendMessage).toHaveBeenCalledWith(ME, TARGET_CONVO, expect.objectContaining({
      body: 'hello',
      forwardedFrom: MESSAGE,
    }))
  })
})

describe('forwarding — targets', () => {
  it('drops the conversation the message came from', async () => {
    const { service, sendMessage } = build()
    await service.forwardMessage(ME, MESSAGE, [SOURCE_CONVO, TARGET_CONVO])
    expect(sendMessage).toHaveBeenCalledTimes(1)
    expect(sendMessage).toHaveBeenCalledWith(ME, TARGET_CONVO, expect.anything())
  })

  it('refuses when the only target was the source', async () => {
    const { service } = build()
    await expect(service.forwardMessage(ME, MESSAGE, [SOURCE_CONVO])).rejects.toBeInstanceOf(
      BadRequestException,
    )
  })

  it('does not send twice to a repeated target', async () => {
    const { service, sendMessage } = build()
    await service.forwardMessage(ME, MESSAGE, [TARGET_CONVO, TARGET_CONVO])
    expect(sendMessage).toHaveBeenCalledTimes(1)
  })

  it('keeps going when one target refuses, and reports which', async () => {
    // Forwarding into three chats where one is announcement-only must deliver
    // the other two rather than failing the lot.
    const { service, sendMessage } = build()
    sendMessage
      .mockResolvedValueOnce({ id: 'a' })
      .mockRejectedValueOnce(
        Object.assign(new Error('forbidden'), { response: { message: 'Only admins can post' } }),
      )
      .mockResolvedValueOnce({ id: 'c' })

    const result = await service.forwardMessage(ME, MESSAGE, ['c1', 'c2', 'c3'])
    expect(result.forwarded).toBe(2)
    expect(result.results.filter((r) => !r.ok)).toEqual([
      { conversationId: 'c2', ok: false, error: 'Only admins can post' },
    ])
  })
})

describe('forwarding — what gets copied', () => {
  it('copies a poll as a NEW poll with no votes carried over', async () => {
    // Two conversations sharing one tally would let people in one move a result
    // the other is reading.
    const { service, sendMessage } = build({
      message: {
        id: MESSAGE,
        conversationId: SOURCE_CONVO,
        isDeleted: false,
        type: 'poll',
        body: null,
        mediaUrls: [],
        metadata: null,
        poll: { question: 'Adopt?', options: [{ text: 'Yes' }, { text: 'No' }] },
      },
    })
    await service.forwardMessage(ME, MESSAGE, [TARGET_CONVO])
    expect(sendMessage).toHaveBeenCalledWith(ME, TARGET_CONVO, expect.objectContaining({
      poll: { question: 'Adopt?', options: ['Yes', 'No'] },
    }))
  })

  it('carries a shared location across', async () => {
    const { service, sendMessage } = build({
      message: {
        id: MESSAGE,
        conversationId: SOURCE_CONVO,
        isDeleted: false,
        type: 'location',
        body: null,
        mediaUrls: [],
        metadata: { location: { lat: 17.38, lng: 78.51 } },
        poll: null,
      },
    })
    await service.forwardMessage(ME, MESSAGE, [TARGET_CONVO])
    expect(sendMessage).toHaveBeenCalledWith(ME, TARGET_CONVO, expect.objectContaining({
      type: 'location',
      metadata: { location: { lat: 17.38, lng: 78.51 } },
    }))
  })

  it('marks every copy as forwarded', async () => {
    const { service, sendMessage } = build()
    await service.forwardMessage(ME, MESSAGE, [TARGET_CONVO])
    const payload = sendMessage.mock.calls[0][2] as { forwardedFrom?: string }
    expect(payload.forwardedFrom).toBe(MESSAGE)
  })
})
