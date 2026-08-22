import { MessagingGateway } from './messaging.gateway'

/**
 * Who is allowed to learn that a call is ringing.
 *
 * The lookup exists because a call invite is a one-shot socket event: an app
 * opened from a device notification has already missed it and has to be able to
 * ask whether it is still being called.
 *
 * The regression this locks down is what that asking leaked. Without a membership
 * check it returned the first call ringing anywhere in the system — handing any
 * authenticated caller a stranger's conversation id and the identity of whoever
 * was dialling, and raising an incoming-call screen for a call they had no part
 * in. Membership is the entire authorisation, so it is the thing worth testing.
 */

const ME = 'me'
const CALLER = 'caller'
const MY_CONVO = 'convo-mine'
const OTHER_CONVO = 'convo-strangers'

function build(memberOf: string[]) {
  const messagingService = {
    isMember: jest.fn(async (userId: string, conversationId: string) =>
      userId === ME && memberOf.includes(conversationId),
    ),
  }
  // Order matters: jwtVerification, messagingService, presence, realtime.
  const gateway = new MessagingGateway(
    {} as never,
    messagingService as never,
    {} as never,
    {} as never,
  )
  const calls = (gateway as unknown as { activeCalls: Map<string, unknown> }).activeCalls
  const ringing = (conversationId: string, callerId: string, acceptedAt: number | null = null) =>
    calls.set(conversationId, {
      callerId,
      callType: 'audio',
      acceptedAt,
      isGroup: false,
      acceptedBy: new Set<string>(),
    })
  return { gateway, ringing, messagingService }
}

describe('getRingingFor', () => {
  it('returns a call in a conversation the member belongs to', async () => {
    const { gateway, ringing } = build([MY_CONVO])
    ringing(MY_CONVO, CALLER)
    await expect(gateway.getRingingFor(ME)).resolves.toMatchObject({
      conversationId: MY_CONVO,
      callerId: CALLER,
    })
  })

  it('never reveals a call between other people', async () => {
    const { gateway, ringing } = build([MY_CONVO])
    ringing(OTHER_CONVO, 'a-stranger')
    await expect(gateway.getRingingFor(ME)).resolves.toBeNull()
  })

  // The leak was worst when both existed: the stranger's call was reached first
  // and returned, so the member was shown the wrong call rather than their own.
  it('skips a stranger call and finds the member own', async () => {
    const { gateway, ringing } = build([MY_CONVO])
    ringing(OTHER_CONVO, 'a-stranger')
    ringing(MY_CONVO, CALLER)
    await expect(gateway.getRingingFor(ME)).resolves.toMatchObject({ conversationId: MY_CONVO })
  })

  it('ignores a call already in progress', async () => {
    const { gateway, ringing } = build([MY_CONVO])
    ringing(MY_CONVO, CALLER, Date.now())
    await expect(gateway.getRingingFor(ME)).resolves.toBeNull()
  })

  it('does not tell the caller that they are being called', async () => {
    const { gateway, ringing } = build([MY_CONVO])
    ringing(MY_CONVO, ME)
    await expect(gateway.getRingingFor(ME)).resolves.toBeNull()
  })

  it('returns null when nothing is ringing', async () => {
    const { gateway } = build([MY_CONVO])
    await expect(gateway.getRingingFor(ME)).resolves.toBeNull()
  })
})
