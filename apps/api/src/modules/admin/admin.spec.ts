import { ForbiddenException, NotFoundException } from '@nestjs/common'
import { AdminService } from './admin.service'

/**
 * The role ladder.
 *
 * Changing a role is the one write that can hand somebody the ability to make
 * the change again, so every way it could be abused is written down here before
 * any test that it works at all.
 *
 * The escalation paths being closed:
 *   - promoting yourself
 *   - an admin minting another admin, or a super_admin
 *   - two admins demoting each other
 *   - anyone touching a super_admin from below
 */

const ACTOR = 'actor-1'
const TARGET = 'target-1'

function build(actorRole: string, targetRole = 'user') {
  const prisma = {
    profile: {
      findUnique: jest.fn().mockImplementation(({ where }: { where: { id: string } }) =>
        Promise.resolve(
          where.id === ACTOR
            ? { role: actorRole, username: 'actor' }
            : where.id === TARGET
              ? { role: targetRole, username: 'target' }
              : null,
        ),
      ),
      update: jest.fn().mockResolvedValue({ id: TARGET, username: 'target', role: 'moderator' }),
      count: jest.fn().mockResolvedValue(0),
      findMany: jest.fn().mockResolvedValue([]),
    },
    post: { count: jest.fn().mockResolvedValue(0) },
    community: { count: jest.fn().mockResolvedValue(0) },
    newsArticle: { count: jest.fn().mockResolvedValue(0) },
    report: { count: jest.fn().mockResolvedValue(0) },
    newsSource: { count: jest.fn().mockResolvedValue(0) },
  }
  const audit = { record: jest.fn().mockResolvedValue(undefined) }
  const service = new AdminService(prisma as never, audit as never)
  return { service, prisma, audit }
}

describe('role changes — escalation is refused', () => {
  it('refuses to let anyone change their own role', async () => {
    // Without this the whole ladder is theatre: any admin promotes themselves.
    const { service, prisma } = build('admin')
    await expect(service.setRole(ACTOR, ACTOR, 'super_admin')).rejects.toBeInstanceOf(ForbiddenException)
    expect(prisma.profile.update).not.toHaveBeenCalled()
  })

  it('refuses an admin minting another admin', async () => {
    // Lateral escalation: two admins can then keep re-appointing each other.
    const { service, prisma } = build('admin')
    await expect(service.setRole(ACTOR, TARGET, 'admin')).rejects.toBeInstanceOf(ForbiddenException)
    expect(prisma.profile.update).not.toHaveBeenCalled()
  })

  it('refuses an admin creating a super_admin', async () => {
    const { service } = build('admin')
    await expect(service.setRole(ACTOR, TARGET, 'super_admin')).rejects.toBeInstanceOf(ForbiddenException)
  })

  it('refuses an admin demoting another admin', async () => {
    const { service, prisma } = build('admin', 'admin')
    await expect(service.setRole(ACTOR, TARGET, 'user')).rejects.toBeInstanceOf(ForbiddenException)
    expect(prisma.profile.update).not.toHaveBeenCalled()
  })

  it('refuses an admin demoting a super_admin', async () => {
    const { service } = build('admin', 'super_admin')
    await expect(service.setRole(ACTOR, TARGET, 'user')).rejects.toBeInstanceOf(ForbiddenException)
  })

  it('refuses a moderator appointing anyone', async () => {
    // The controller guard already blocks this; the service does not rely on it.
    const { service } = build('moderator')
    await expect(service.setRole(ACTOR, TARGET, 'moderator')).rejects.toBeInstanceOf(ForbiddenException)
  })

  it('refuses an ordinary member outright', async () => {
    const { service } = build('user')
    await expect(service.setRole(ACTOR, TARGET, 'moderator')).rejects.toBeInstanceOf(ForbiddenException)
  })

  it('treats an unrecognised actor role as the lowest rank, not the highest', async () => {
    // A role added to the enum later must not accidentally outrank everything.
    const { service } = build('something_new')
    await expect(service.setRole(ACTOR, TARGET, 'moderator')).rejects.toBeInstanceOf(ForbiddenException)
  })

  it('refuses an unknown role name', async () => {
    const { service } = build('super_admin')
    await expect(service.setRole(ACTOR, TARGET, 'root' as never)).rejects.toThrow()
  })

  it('refuses a target that does not exist', async () => {
    const { service } = build('super_admin')
    await expect(service.setRole(ACTOR, 'nobody', 'moderator')).rejects.toBeInstanceOf(NotFoundException)
  })
})

describe('role changes — what is allowed', () => {
  it('lets an admin appoint a moderator', async () => {
    const { service, prisma } = build('admin')
    await expect(service.setRole(ACTOR, TARGET, 'moderator')).resolves.toMatchObject({ role: 'moderator' })
    expect(prisma.profile.update).toHaveBeenCalled()
  })

  it('lets a super_admin appoint an admin', async () => {
    const { service, prisma } = build('super_admin')
    await service.setRole(ACTOR, TARGET, 'admin')
    expect(prisma.profile.update).toHaveBeenCalledWith(
      expect.objectContaining({ data: { role: 'admin' } }),
    )
  })

  it('lets an admin demote a moderator back to user', async () => {
    const { service, prisma } = build('admin', 'moderator')
    await service.setRole(ACTOR, TARGET, 'user')
    expect(prisma.profile.update).toHaveBeenCalled()
  })

  it('records the change with both the old and the new role', async () => {
    // "Who made this person an admin" is the question asked after something
    // goes wrong, and it can only be answered if the old value was kept.
    const { service, audit } = build('super_admin', 'user')
    await service.setRole(ACTOR, TARGET, 'admin')
    expect(audit.record).toHaveBeenCalledWith(
      expect.objectContaining({
        actorId: ACTOR,
        action: 'user.role_changed',
        entityId: TARGET,
        oldData: { role: 'user' },
        newData: { role: 'admin' },
      }),
    )
  })

  it('does not record anything when the change was refused', async () => {
    const { service, audit } = build('admin')
    await expect(service.setRole(ACTOR, TARGET, 'admin')).rejects.toBeInstanceOf(ForbiddenException)
    expect(audit.record).not.toHaveBeenCalled()
  })
})
