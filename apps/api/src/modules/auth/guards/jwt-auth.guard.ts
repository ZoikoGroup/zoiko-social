import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { JwtVerificationService } from '../jwt-verification.service'
import { Reflector } from '@nestjs/core'
import { PrismaService } from '../../prisma/prisma.service'
import { ALLOW_INACTIVE_ACCOUNT } from '../decorators/allow-inactive.decorator'
import { accountStateCache, type AccountState } from '../account-state-cache'

export const AUTH_USER_KEY = 'auth_user'

export interface AuthenticatedUser {
  id: string
  email: string
  role: string
}

/**
 * Why each non-active state refuses a request.
 *
 * The two member-chosen states used to say "sign in again to reactivate", which
 * was true when signing in restored the account by itself. It no longer does —
 * restoring is an explicit confirmation now — so telling someone to sign in again
 * would send them round a loop that changes nothing.
 */
const ACCOUNT_STATE_ERRORS: Record<string, { code: string; message: string }> = {
  banned: { code: 'ACCOUNT_BANNED', message: 'This account has been banned.' },
  suspended: { code: 'ACCOUNT_SUSPENDED', message: 'This account is temporarily suspended.' },
  deleted: { code: 'ACCOUNT_DELETED', message: 'This account has been deleted.' },
  deactivated: {
    code: 'ACCOUNT_DEACTIVATED',
    message: 'This account is deactivated. Reactivate it to continue.',
  },
  pending_deletion: {
    code: 'ACCOUNT_PENDING_DELETION',
    message: 'This account is scheduled for deletion. Reactivate it to cancel the deletion.',
  },
}

/**
 * JwtAuthGuard — verifies the Bearer token from the Authorization header.
 *
 * Uses local JWT verification via JOSE + Supabase JWKS (no network request
 * during normal authentication). Falls back to Supabase auth.getUser() if
 * the JWKS endpoint is unreachable or verification fails unexpectedly.
 */

/**
 * The only states a route marked @AllowInactiveAccount() may run under: the two
 * the member chose themselves. A moderator's suspension or ban is never bypassed,
 * however the route is annotated.
 */
const MEMBER_CHOSEN_STATES = new Set(['deactivated', 'pending_deletion'])

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name)

  constructor(
    private readonly jwtVerification: JwtVerificationService,
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>()
    const authHeader = request.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException({
        code: 'MISSING_TOKEN',
        message: 'Authorization token is required',
      })
    }

    const token = authHeader.split(' ')[1]

    try {
      const user = await this.jwtVerification.verify(token)

      // Enforce Trust & Safety suspension/ban — a token can still verify
      // cryptographically after a moderator suspends or bans the account.
      const now = Date.now()
      const cached = accountStateCache.get(user.id, now)
      let profile: AccountState
      if (cached) {
        profile = cached.value
      } else {
        profile = await this.prisma.profile.findUnique({
          where: { id: user.id },
          // The two timestamps ride along so the refusal can say *when* — the web
          // app signs in straight against Supabase for email and phone, so this
          // 403 is the only signal it reliably sees, and "deactivated 3 days ago"
          // needs a date the login response never carries on that path.
          select: { state: true, deactivatedAt: true, deletionRequestedAt: true },
        })
        accountStateCache.set(user.id, profile, now)
      }
      const allowInactive =
        this.reflector.getAllAndOverride<boolean>(ALLOW_INACTIVE_ACCOUNT, [
          context.getHandler(),
          context.getClass(),
        ]) ?? false

      if (
        profile &&
        profile.state !== 'active' &&
        !(allowInactive && MEMBER_CHOSEN_STATES.has(profile.state))
      ) {
        // Distinct codes matter: a member who deactivated or scheduled deletion
        // needs to be told to sign in again to restore the account, which is a
        // very different message from a moderator's suspension or ban.
        const { code, message } = ACCOUNT_STATE_ERRORS[profile.state] ?? {
          code: 'ACCOUNT_SUSPENDED',
          message: 'This account is temporarily suspended.',
        }
        const since =
          profile.state === 'pending_deletion'
            ? profile.deletionRequestedAt?.toISOString()
            : profile.state === 'deactivated'
              ? profile.deactivatedAt?.toISOString()
              : undefined
        throw new ForbiddenException({ code, message, ...(since ? { since } : {}) })
      }

      // Attach user to request for downstream use
      ;(request as unknown as Record<string, unknown>)[AUTH_USER_KEY] = user

      return true
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof ForbiddenException) {
        throw error
      }
      this.logger.error(`Auth error: ${(error as Error).message}`)
      throw new UnauthorizedException({
        code: 'AUTH_ERROR',
        message: 'Authentication failed',
      })
    }
  }
}
