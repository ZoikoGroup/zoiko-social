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
import { PrismaService } from '../../prisma/prisma.service'

export const AUTH_USER_KEY = 'auth_user'

export interface AuthenticatedUser {
  id: string
  email: string
  role: string
}

/**
 * Why each non-active state refuses a request. Signing in again is the route back
 * from the two member-initiated states, so their messages say so.
 */
const ACCOUNT_STATE_ERRORS: Record<string, { code: string; message: string }> = {
  banned: { code: 'ACCOUNT_BANNED', message: 'This account has been banned.' },
  suspended: { code: 'ACCOUNT_SUSPENDED', message: 'This account is temporarily suspended.' },
  deleted: { code: 'ACCOUNT_DELETED', message: 'This account has been deleted.' },
  deactivated: {
    code: 'ACCOUNT_DEACTIVATED',
    message: 'This account is deactivated. Sign in again to reactivate it.',
  },
  pending_deletion: {
    code: 'ACCOUNT_PENDING_DELETION',
    message: 'This account is scheduled for deletion. Sign in again to cancel it.',
  },
}

/**
 * JwtAuthGuard — verifies the Bearer token from the Authorization header.
 *
 * Uses local JWT verification via JOSE + Supabase JWKS (no network request
 * during normal authentication). Falls back to Supabase auth.getUser() if
 * the JWKS endpoint is unreachable or verification fails unexpectedly.
 */

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name)

  constructor(
    private readonly jwtVerification: JwtVerificationService,
    private readonly prisma: PrismaService,
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
      const profile = await this.prisma.profile.findUnique({
        where: { id: user.id },
        select: { state: true },
      })
      if (profile && profile.state !== 'active') {
        // Distinct codes matter: a member who deactivated or scheduled deletion
        // needs to be told to sign in again to restore the account, which is a
        // very different message from a moderator's suspension or ban.
        const { code, message } = ACCOUNT_STATE_ERRORS[profile.state] ?? {
          code: 'ACCOUNT_SUSPENDED',
          message: 'This account is temporarily suspended.',
        }
        throw new ForbiddenException({ code, message })
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
