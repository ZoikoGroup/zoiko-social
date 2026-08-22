import { MessagingService } from './messaging.service'

/**
 * Ringing a device for an incoming call.
 *
 * A call invite travels over a socket, which reaches only someone whose app is
 * already open. A phone in a pocket got nothing at all — no ring, and afterwards
 * not even the missed-call notification, because that is written when the call
 * closes. This is the part that reaches it.
 *
 * The gates are the same as any message: a muted conversation does not ring, and
 * neither does a member who switched the Messages category off. Ringing someone
 * who asked not to be reached is worse than any other notification, because it
 * makes a noise.
 */

const CALLER = 'caller-1'
const RECIPIENT = 'recipient-1'
const CONVO = 'convo-1'

function build(opts: { muted?: boolean; allowed?: boolean } = {}) {
  const { muted = false, allowed = true } = opts
  const prisma = {
    conversationMember: { findMany: jest.fn().mockResolvedValue([{ userId: RECIPIENT }]) },
    conversationSetting: {
      findMany: jest.fn().mockResolvedValue(muted ? [{ userId: RECIPIENT }] : []),
    },
  }
  const sendToUser = jest.fn().mockResolvedValue({ sent: 1, pruned: 0 })
  const allowsPush = jest.fn().mockResolvedValue(allowed)

  const service = new MessagingService(
    prisma as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    { sendToUser } as never,
    { allowsPush } as never,
  )
  ;(service as unknown as { logger: unknown }).logger = { warn: jest.fn(), debug: jest.fn() }
  return { service, sendToUser, allowsPush }
}

describe('pushIncomingCall', () => {
  it('rings the person being called', async () => {
    const { service, sendToUser } = build()
    await service.pushIncomingCall(CONVO, CALLER, 'The Caller', 'audio', RECIPIENT)
    expect(sendToUser).toHaveBeenCalledWith(
      RECIPIENT,
      expect.objectContaining({
        title: 'The Caller',
        body: 'Incoming voice call',
        type: 'call_invite',
        url: `/messages?conversation=${CONVO}&call=incoming`,
      }),
    )
  })

  it('says which kind of call it is', async () => {
    const { service, sendToUser } = build()
    await service.pushIncomingCall(CONVO, CALLER, 'The Caller', 'video', RECIPIENT)
    expect(sendToUser.mock.calls[0][1].body).toBe('Incoming video call')
  })

  // A re-dial should replace the previous ring rather than leave two on screen.
  it('collapses re-dials into one slot', async () => {
    const { service, sendToUser } = build()
    await service.pushIncomingCall(CONVO, CALLER, 'The Caller', 'audio', RECIPIENT)
    expect(sendToUser.mock.calls[0][1].collapseKey).toBe('call.incoming')
  })

  it('does not ring a muted conversation', async () => {
    const { service, sendToUser } = build({ muted: true })
    await service.pushIncomingCall(CONVO, CALLER, 'The Caller', 'audio', RECIPIENT)
    expect(sendToUser).not.toHaveBeenCalled()
  })

  it('does not ring someone who switched Messages off', async () => {
    const { service, sendToUser } = build({ allowed: false })
    await service.pushIncomingCall(CONVO, CALLER, 'The Caller', 'audio', RECIPIENT)
    expect(sendToUser).not.toHaveBeenCalled()
  })

  it('rings every unmuted member of a group call', async () => {
    const { service, sendToUser } = build()
    await service.pushIncomingCall(CONVO, CALLER, 'The Caller', 'audio')
    expect(sendToUser).toHaveBeenCalledTimes(1)
    expect(sendToUser).toHaveBeenCalledWith(RECIPIENT, expect.anything())
  })

  it('never throws into the signalling path', async () => {
    const { service, sendToUser } = build()
    sendToUser.mockRejectedValue(new Error('push service unreachable'))
    await expect(
      service.pushIncomingCall(CONVO, CALLER, 'The Caller', 'audio', RECIPIENT),
    ).resolves.toBeUndefined()
  })
})
