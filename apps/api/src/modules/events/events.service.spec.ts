import { ForbiddenException, BadRequestException } from '@nestjs/common'
import { EventsService } from './events.service'
import type { PrismaService } from '../prisma/prisma.service'

const HOST = 'host-1'
const GUEST = 'guest-1'
const STRANGER = 'stranger-1'

/** Minimal event row shape the service maps (only the fields it reads). */
function eventRow(overrides: Record<string, unknown> = {}) {
  return {
    id: 'evt-1',
    hostId: HOST,
    title: 'Puppy Playdate',
    description: null,
    location: null,
    venueName: null,
    visibility: 'public',
    inviteOnly: false,
    shareToken: 'tok-1',
    shareLinkExtendsInvites: false,
    isOnline: false,
    coverUrl: null,
    videoUrl: null,
    category: null,
    isFree: true,
    price: null,
    bookingUrl: null,
    capacity: null,
    latitude: null,
    longitude: null,
    startsAt: new Date('2026-09-01T10:00:00Z'),
    endsAt: null,
    goingCount: 1,
    isDeleted: false,
    createdAt: new Date('2026-08-01T00:00:00Z'),
    updatedAt: new Date('2026-08-01T00:00:00Z'),
    host: {
      id: HOST,
      username: 'hosty',
      displayName: 'Hosty',
      avatarUrl: null,
      verificationTier: 'none',
    },
    ...overrides,
  }
}

function build(overrides: {
  event?: Record<string, unknown> | null
  rsvp?: { eventId: string; userId: string; status: string } | null
  invite?: { eventId: string; userId: string; status?: string } | null
  invites?: { userId: string; status: string; createdAt: Date }[]
  profiles?: { id: string; state: string }[]
  attendees?: { userId: string }[]
} = {}) {
  const prisma = {
    event: {
      // Always merge overrides onto the full row so map() has host + all fields.
      findUnique: jest.fn().mockImplementation(({ where }: { where?: { id?: string } }) =>
        Promise.resolve(where?.id === 'missing' ? null : eventRow(overrides.event ?? {})),
      ),
      findMany: jest.fn().mockResolvedValue([eventRow(overrides.event ?? {})]),
      create: jest.fn().mockImplementation(({ data }: { data: Record<string, unknown> }) =>
        Promise.resolve(eventRow({ ...overrides.event, ...data })),
      ),
      update: jest.fn().mockImplementation(({ data }: { data: Record<string, unknown> }) =>
        Promise.resolve(eventRow({ ...overrides.event, ...data })),
      ),
    },
    eventRsvp: {
      findUnique: jest.fn().mockResolvedValue(overrides.rsvp === undefined ? null : overrides.rsvp),
      findMany: jest.fn().mockResolvedValue(overrides.attendees ?? []),
      create: jest.fn().mockResolvedValue({}),
      update: jest.fn().mockResolvedValue({}),
      delete: jest.fn().mockResolvedValue({}),
    },
    eventInvite: {
      findUnique: jest.fn().mockResolvedValue(overrides.invite === undefined ? null : overrides.invite),
      // Honour the status filter the service sends so declined rows don't count
      // as active invites (invitedFlags / visibilityWhere).
      findMany: jest.fn().mockImplementation((args: { where?: { status?: { not?: string } } }) => {
        const rows = overrides.invites ?? []
        const exclude = args?.where?.status?.not
        const list = exclude ? rows.filter((i) => i.status !== exclude) : rows
        return Promise.resolve(list.map((i) => ({
          eventId: 'evt-1',
          userId: i.userId,
          status: i.status,
          createdAt: i.createdAt,
          invitedBy: HOST,
          user: {
            id: i.userId,
            username: `user-${i.userId}`,
            displayName: `User ${i.userId}`,
            avatarUrl: null,
            verificationTier: 'none',
          },
        })))
      }),
      createMany: jest.fn().mockResolvedValue({ count: 0 }),
      update: jest.fn().mockResolvedValue({}),
      updateMany: jest.fn().mockResolvedValue({ count: 0 }),
      delete: jest.fn().mockResolvedValue({}),
    },
    profile: {
      // Honour the `state` filter like the real query so deleted users drop out.
      findMany: jest.fn().mockImplementation((args: { where?: { state?: string } }) => {
        const list = overrides.profiles ?? [{ id: GUEST, state: 'active' }]
        const state = args?.where?.state
        return Promise.resolve(state ? list.filter((p) => p.state === state) : list)
      }),
    },
    follow: {
      findFirst: jest.fn().mockResolvedValue(null),
    },
    $transaction: jest.fn().mockImplementation((fn: (tx: unknown) => unknown) => fn(prisma)),
  }

  const service = new EventsService(prisma as unknown as PrismaService)
  return { service, prisma }
}

describe('EventsService invite-only access', () => {
  it('rsvp rejects a stranger on an invite-only event with EVENT_NOT_INVITED', async () => {
    const { service, prisma } = build({ event: { inviteOnly: true, hostId: HOST } })

    await expect(service.rsvp('evt-1', STRANGER, {})).rejects.toMatchObject({
      response: { code: 'EVENT_NOT_INVITED' },
    })
    expect(prisma.eventInvite.findUnique).toHaveBeenCalledWith({
      where: { eventId_userId: { eventId: 'evt-1', userId: STRANGER } },
      select: { userId: true, status: true },
    })
  })

  it('rsvp allows an invited user on an invite-only event', async () => {
    const { service, prisma } = build({
      event: { inviteOnly: true, hostId: HOST, capacity: null },
      invite: { eventId: 'evt-1', userId: GUEST },
    })

    const result = await service.rsvp('evt-1', GUEST, { status: 'going' })
    expect(result.going).toBe(true)
    expect(prisma.eventRsvp.create).toHaveBeenCalled()
  })

  it('rsvp allows the host on an invite-only event without an invite row', async () => {
    const { service, prisma } = build({
      event: { inviteOnly: true, hostId: HOST, capacity: null },
      invite: null,
    })

    const result = await service.rsvp('evt-1', HOST, { status: 'going' })
    expect(result.going).toBe(true)
    expect(prisma.eventInvite.findUnique).not.toHaveBeenCalled()
  })

  it('get hides an invite-only event from a non-invited viewer', async () => {
    const { service } = build({ event: { inviteOnly: true, hostId: HOST } })

    await expect(service.get('evt-1', STRANGER)).rejects.toMatchObject({
      response: { code: 'EVENT_NOT_INVITED' },
    })
  })

  it('list hides invite-only events from a non-invited viewer', async () => {
    const { service, prisma } = build({ event: { inviteOnly: true, hostId: HOST } })

    await service.list(STRANGER, null, 15)

    // The viewer's OR-gate must include the invite filter so invite-only
    // events they're not invited to never reach the results.
    const where = prisma.event.findMany.mock.calls[0][0].where
    const orClause = where.AND.find((c: { OR?: unknown }) => c.OR)
    expect(orClause).toBeDefined()
    const or = orClause?.OR as { inviteOnly?: boolean; invites?: unknown }[]
    expect(or.some((c) => c.inviteOnly === true && 'invites' in c)).toBe(true)
  })

  it('update auto-invite excludes a host attendee', async () => {
    const { service, prisma } = build({
      event: { inviteOnly: false, hostId: HOST },
      attendees: [{ userId: GUEST }, { userId: HOST }],
    })

    await service.update('evt-1', HOST, { inviteOnly: true })

    expect(prisma.eventInvite.createMany).toHaveBeenCalledWith({
      data: [{ eventId: 'evt-1', userId: GUEST, invitedBy: HOST }],
      skipDuplicates: true,
    })
  })

  it('removeInvite is a no-op when the host revokes themselves (no self-RSVP deletion)', async () => {
    const { service, prisma } = build({
      event: { inviteOnly: true, hostId: HOST, goingCount: 1 },
      rsvp: { eventId: 'evt-1', userId: HOST, status: 'going' },
    })

    await service.removeInvite('evt-1', HOST, HOST)

    expect(prisma.eventInvite.delete).not.toHaveBeenCalled()
    expect(prisma.eventRsvp.delete).not.toHaveBeenCalled()
    expect(prisma.event.update).not.toHaveBeenCalled()
  })

  it('get exposes an invite-only event to an invited viewer with viewerInvited=true', async () => {
    const { service } = build({
      event: { inviteOnly: true, hostId: HOST },
      invite: { eventId: 'evt-1', userId: GUEST },
      // invitedFlags reads the invite list via findMany (not findUnique)
      invites: [{ userId: GUEST, status: 'invited', createdAt: new Date('2026-08-02T00:00:00Z') }],
    })

    const result = await service.get('evt-1', GUEST)
    expect(result.inviteOnly).toBe(true)
    expect(result.viewerInvited).toBe(true)
  })

  it('invite rejects non-host callers', async () => {
    const { service } = build({ event: { inviteOnly: true, hostId: HOST } })

    await expect(service.invite('evt-1', STRANGER, [GUEST])).rejects.toBeInstanceOf(ForbiddenException)
  })

  it('invite requires an invite-only event', async () => {
    const { service } = build({ event: { inviteOnly: false, hostId: HOST } })

    await expect(service.invite('evt-1', HOST, [GUEST])).rejects.toBeInstanceOf(BadRequestException)
  })

  it('invite creates rows only for existing active users, excluding the host', async () => {
    const { service, prisma } = build({
      event: { inviteOnly: true, hostId: HOST },
      profiles: [
        { id: GUEST, state: 'active' },
        { id: 'ghost', state: 'deleted' },
      ],
    })

    const result = await service.invite('evt-1', HOST, [GUEST, 'ghost', HOST])
    expect(result.invited).toBe(1)
    expect(prisma.eventInvite.createMany).toHaveBeenCalledWith({
      data: [{ eventId: 'evt-1', userId: GUEST, invitedBy: HOST }],
      skipDuplicates: true,
    })
  })

  it('listInvites returns invitees with profile info (host only)', async () => {
    const { service } = build({
      event: { inviteOnly: true, hostId: HOST },
      invites: [{ userId: GUEST, status: 'invited', createdAt: new Date('2026-08-02T00:00:00Z') }],
    })

    const result = await service.listInvites('evt-1', HOST)
    expect(result).toHaveLength(1)
    expect(result[0]!.id).toBe(GUEST)
    expect(result[0]!.status).toBe('invited')
  })

  it('create seeds invites when inviteOnly with invitees, excluding the host', async () => {
    const { service, prisma } = build({})

    await service.create(HOST, {
      title: 'Party',
      startsAt: '2026-09-01T10:00:00Z',
      inviteOnly: true,
      invitees: [GUEST, HOST],
    })

    expect(prisma.event.create).toHaveBeenCalled()
    expect(prisma.eventInvite.createMany).toHaveBeenCalledWith({
      data: [{ eventId: 'evt-1', userId: GUEST, invitedBy: HOST }],
      skipDuplicates: true,
    })
  })

  it('update auto-invites existing attendees when invite-only is turned on', async () => {
    const { service, prisma } = build({
      event: { inviteOnly: false, hostId: HOST },
      attendees: [{ userId: GUEST }],
    })

    await service.update('evt-1', HOST, { inviteOnly: true })

    expect(prisma.eventInvite.createMany).toHaveBeenCalledWith({
      data: [{ eventId: 'evt-1', userId: GUEST, invitedBy: HOST }],
      skipDuplicates: true,
    })
  })

  it('update adds newly-picked invitees (host excluded, deduped)', async () => {
    const { service, prisma } = build({
      event: { inviteOnly: true, hostId: HOST },
    })

    await service.update('evt-1', HOST, { invitees: [GUEST, GUEST, HOST] })

    expect(prisma.eventInvite.createMany).toHaveBeenCalledWith({
      data: [{ eventId: 'evt-1', userId: GUEST, invitedBy: HOST }],
      skipDuplicates: true,
    })
  })

  it('removeInvite is idempotent (missing invite does not throw)', async () => {
    const { service } = build({ event: { inviteOnly: true, hostId: HOST } })

    await expect(service.removeInvite('evt-1', HOST, GUEST)).resolves.toBeUndefined()
  })

  it('removeInvite also drops a revoked invitee\'s RSVP so goingCount stays accurate', async () => {
    const { service, prisma } = build({
      event: { inviteOnly: true, hostId: HOST, goingCount: 2 },
      rsvp: { eventId: 'evt-1', userId: GUEST, status: 'going' },
    })

    await service.removeInvite('evt-1', HOST, GUEST)

    expect(prisma.eventInvite.delete).toHaveBeenCalledWith({
      where: { eventId_userId: { eventId: 'evt-1', userId: GUEST } },
    })
    expect(prisma.eventRsvp.delete).toHaveBeenCalledWith({
      where: { eventId_userId: { eventId: 'evt-1', userId: GUEST } },
    })
    expect(prisma.event.update).toHaveBeenCalledWith({
      where: { id: 'evt-1' },
      data: { goingCount: { decrement: 1 } },
    })
  })

  // ── Share-link access ────────────────────────────────────────────────────

  it('create generates a share token for every event', async () => {
    const { service, prisma } = build({})

    await service.create(HOST, { title: 'Party', startsAt: '2026-09-01T10:00:00Z' })

    const data = prisma.event.create.mock.calls[0][0].data
    expect(typeof data.shareToken).toBe('string')
    expect(data.shareToken.length).toBeGreaterThan(8)
    expect(data.shareLinkExtendsInvites).toBe(false)
  })

  it('get lets a valid share-link holder see an invite-only event without an invite row', async () => {
    const { service } = build({ event: { inviteOnly: true, hostId: HOST, shareToken: 'tok-1' } })

    const result = await service.get('evt-1', STRANGER, 'tok-1')
    expect(result.inviteOnly).toBe(true)
    expect(result.viewerInvited).toBe(false)
  })

  it('get still blocks a wrong share token on an invite-only event', async () => {
    const { service } = build({ event: { inviteOnly: true, hostId: HOST, shareToken: 'tok-1' } })

    await expect(service.get('evt-1', STRANGER, 'wrong-token')).rejects.toMatchObject({
      response: { code: 'EVENT_NOT_INVITED' },
    })
  })

  it('rsvp lets a valid share-link holder join an invite-only event without an invite row', async () => {
    const { service, prisma } = build({
      event: { inviteOnly: true, hostId: HOST, shareToken: 'tok-1', capacity: null },
      invite: null,
    })

    const result = await service.rsvp('evt-1', STRANGER, { status: 'going' }, 'tok-1')
    expect(result.going).toBe(true)
    expect(prisma.eventRsvp.create).toHaveBeenCalled()
  })

  it('join with extends-invites ON adds the joiner to the invite list', async () => {
    const { service, prisma } = build({
      event: { inviteOnly: true, hostId: HOST, shareToken: 'tok-1', shareLinkExtendsInvites: true },
      // invitedFlags reads the invite list via findMany — mirror the row the
      // createMany call just inserted.
      invites: [{ userId: GUEST, status: 'invited', createdAt: new Date('2026-08-02T00:00:00Z') }],
    })

    const result = await service.join('evt-1', GUEST, 'tok-1')

    expect(prisma.eventInvite.createMany).toHaveBeenCalledWith({
      data: [{ eventId: 'evt-1', userId: GUEST, invitedBy: HOST }],
      skipDuplicates: true,
    })
    expect(result.viewerInvited).toBe(true)
  })

  it('join with extends-invites OFF grants access without an invite row', async () => {
    const { service, prisma } = build({
      event: { inviteOnly: true, hostId: HOST, shareToken: 'tok-1', shareLinkExtendsInvites: false },
    })

    const result = await service.join('evt-1', GUEST, 'tok-1')

    expect(prisma.eventInvite.createMany).not.toHaveBeenCalled()
    expect(result.viewerInvited).toBe(false)
    expect(result.inviteOnly).toBe(true)
  })

  it('join rejects an invalid/expired share token', async () => {
    const { service } = build({ event: { inviteOnly: true, hostId: HOST, shareToken: 'tok-1' } })

    await expect(service.join('evt-1', GUEST, 'stale-token')).rejects.toMatchObject({
      response: { code: 'INVALID_SHARE_LINK' },
    })
  })

  it('join is a no-op for the host (never creates a self-invite row)', async () => {
    const { service, prisma } = build({
      event: { inviteOnly: true, hostId: HOST, shareToken: 'tok-1', shareLinkExtendsInvites: true },
    })

    const result = await service.join('evt-1', HOST, 'tok-1')

    expect(prisma.eventInvite.createMany).not.toHaveBeenCalled()
    expect(result.viewerInvited).toBe(false)
  })

  it('updateShareLink regenerates the token and toggles extends-invites (host only)', async () => {
    const { service, prisma } = build({ event: { inviteOnly: true, hostId: HOST } })

    const result = await service.updateShareLink('evt-1', HOST, { reset: true, extendsInvites: true })

    const update = prisma.event.update.mock.calls[0][0]
    expect(typeof update.data.shareToken).toBe('string')
    expect(update.data.shareToken).not.toBe('tok-1')
    expect(update.data.shareLinkExtendsInvites).toBe(true)
    expect(result.shareLinkExtendsInvites).toBe(true)
  })

  it('updateShareLink rejects non-host callers', async () => {
    const { service } = build({ event: { inviteOnly: true, hostId: HOST } })

    await expect(service.updateShareLink('evt-1', STRANGER, { reset: true })).rejects.toBeInstanceOf(ForbiddenException)
  })

  it('get lets a share-link holder in even when the event is invite-only AND followers-only', async () => {
    const { service } = build({
      event: { inviteOnly: true, visibility: 'followers', hostId: HOST, shareToken: 'tok-1' },
    })

    const result = await service.get('evt-1', STRANGER, 'tok-1')
    expect(result.inviteOnly).toBe(true)
    expect(result.visibility).toBe('followers')
  })

  it('join works on a public event (no invite row, no gate)', async () => {
    const { service, prisma } = build({
      event: { inviteOnly: false, hostId: HOST, shareToken: 'tok-1' },
    })

    const result = await service.join('evt-1', GUEST, 'tok-1')
    expect(prisma.eventInvite.createMany).not.toHaveBeenCalled()
    expect(result.inviteOnly).toBe(false)
  })

  it('re-joining via link is idempotent for an already-invited user (skipDuplicates)', async () => {
    const { service, prisma } = build({
      event: { inviteOnly: true, hostId: HOST, shareToken: 'tok-1', shareLinkExtendsInvites: true },
      invites: [{ userId: GUEST, status: 'invited', createdAt: new Date('2026-08-02T00:00:00Z') }],
    })

    const result = await service.join('evt-1', GUEST, 'tok-1')
    await service.join('evt-1', GUEST, 'tok-1')

    expect(prisma.eventInvite.createMany).toHaveBeenCalledWith({
      data: [{ eventId: 'evt-1', userId: GUEST, invitedBy: HOST }],
      skipDuplicates: true,
    })
    expect(result.viewerInvited).toBe(true)
  })

  it('update persists shareLinkExtendsInvites', async () => {
    const { service, prisma } = build({
      event: { inviteOnly: true, hostId: HOST },
    })

    await service.update('evt-1', HOST, { shareLinkExtendsInvites: true })

    expect(prisma.event.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: expect.objectContaining({ shareLinkExtendsInvites: true }) }),
    )
  })

  // ── Decline flow ─────────────────────────────────────────────────────────

  it('decline marks the invite declined and drops the RSVP + goingCount', async () => {
    const { service, prisma } = build({
      event: { inviteOnly: true, hostId: HOST, goingCount: 2 },
      invite: { eventId: 'evt-1', userId: GUEST, status: 'invited' },
      rsvp: { eventId: 'evt-1', userId: GUEST, status: 'going' },
    })

    const result = await service.decline('evt-1', GUEST)

    expect(prisma.eventInvite.update).toHaveBeenCalledWith({
      where: { eventId_userId: { eventId: 'evt-1', userId: GUEST } },
      data: { status: 'declined' },
    })
    expect(prisma.eventRsvp.delete).toHaveBeenCalledWith({
      where: { eventId_userId: { eventId: 'evt-1', userId: GUEST } },
    })
    expect(prisma.event.update).toHaveBeenCalledWith({
      where: { id: 'evt-1' },
      data: { goingCount: { decrement: 1 } },
      select: { goingCount: true },
    })
    expect(result.declined).toBe(true)
  })

  it('decline is idempotent when already declined (no re-write, RSVP untouched)', async () => {
    const { service, prisma } = build({
      event: { inviteOnly: true, hostId: HOST },
      invite: { eventId: 'evt-1', userId: GUEST, status: 'declined' },
      rsvp: null,
    })

    const result = await service.decline('evt-1', GUEST)

    expect(prisma.eventInvite.update).not.toHaveBeenCalled()
    expect(prisma.eventRsvp.delete).not.toHaveBeenCalled()
    expect(result.declined).toBe(true)
  })

  it('decline rejects a caller with no invite row (NOT_INVITED)', async () => {
    const { service, prisma } = build({ event: { inviteOnly: true, hostId: HOST } })

    await expect(service.decline('evt-1', GUEST)).rejects.toMatchObject({
      response: { code: 'NOT_INVITED' },
    })
    expect(prisma.eventInvite.update).not.toHaveBeenCalled()
    expect(prisma.eventRsvp.delete).not.toHaveBeenCalled()
  })

  it('get blocks a declined user on an invite-only event', async () => {
    const { service } = build({
      event: { inviteOnly: true, hostId: HOST },
      invite: { eventId: 'evt-1', userId: GUEST, status: 'declined' },
    })

    await expect(service.get('evt-1', GUEST)).rejects.toMatchObject({
      response: { code: 'EVENT_NOT_INVITED' },
    })
  })

  it('list excludes a declined user\'s invite-only event (removed from their event list)', async () => {
    const { service, prisma } = build({
      event: { inviteOnly: true, hostId: HOST },
      invites: [{ userId: GUEST, status: 'declined', createdAt: new Date('2026-08-02T00:00:00Z') }],
    })

    const result = await service.list(GUEST, null, 15)

    // The OR-gate filters invites to active (non-declined) status only.
    const where = prisma.event.findMany.mock.calls[0][0].where
    const orClause = where.AND.find((c: { OR?: unknown }) => c.OR)?.OR as { inviteOnly?: boolean; invites?: { some?: { status?: { not?: string } } } }[]
    const inviteClause = orClause.find((c) => c.inviteOnly === true && c.invites)
    expect(inviteClause?.invites?.some?.status?.not).toBe('declined')
    // And the (declined-only) invite list yields no viewerInvited matches.
    expect(result.data.some((e) => e.id === 'evt-1' && e.viewerInvited)).toBe(false)
  })

  it('rsvp blocks a declined user on an invite-only event', async () => {
    const { service } = build({
      event: { inviteOnly: true, hostId: HOST, capacity: null },
      invite: { eventId: 'evt-1', userId: GUEST, status: 'declined' },
    })

    await expect(service.rsvp('evt-1', GUEST, { status: 'going' })).rejects.toMatchObject({
      response: { code: 'EVENT_NOT_INVITED' },
    })
  })

  it('invite re-invites a declined user (flips status back to invited)', async () => {
    const { service, prisma } = build({
      event: { inviteOnly: true, hostId: HOST },
      profiles: [{ id: GUEST, state: 'active' }],
    })

    await service.invite('evt-1', HOST, [GUEST])

    expect(prisma.eventInvite.updateMany).toHaveBeenCalledWith({
      where: { eventId: 'evt-1', userId: { in: [GUEST] }, status: 'declined' },
      data: { status: 'invited' },
    })
    expect(prisma.eventInvite.createMany).toHaveBeenCalledWith({
      data: [{ eventId: 'evt-1', userId: GUEST, invitedBy: HOST }],
      skipDuplicates: true,
    })
  })

  it('join via an extends-invites link re-accepts a declined user', async () => {
    const { service, prisma } = build({
      event: { inviteOnly: true, hostId: HOST, shareToken: 'tok-1', shareLinkExtendsInvites: true },
      invite: { eventId: 'evt-1', userId: GUEST, status: 'declined' },
    })

    await service.join('evt-1', GUEST, 'tok-1')

    expect(prisma.eventInvite.updateMany).toHaveBeenCalledWith({
      where: { eventId: 'evt-1', userId: GUEST, status: 'declined' },
      data: { status: 'invited' },
    })
    expect(prisma.eventInvite.createMany).toHaveBeenCalledWith({
      data: [{ eventId: 'evt-1', userId: GUEST, invitedBy: HOST }],
      skipDuplicates: true,
    })
  })

  it('update re-picking a declined user flips them back to invited', async () => {
    const { service, prisma } = build({
      event: { inviteOnly: true, hostId: HOST },
    })

    await service.update('evt-1', HOST, { invitees: [GUEST] })

    expect(prisma.eventInvite.updateMany).toHaveBeenCalledWith({
      where: { eventId: 'evt-1', userId: { in: [GUEST] }, status: 'declined' },
      data: { status: 'invited' },
    })
  })
})
