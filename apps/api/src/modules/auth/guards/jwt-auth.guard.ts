import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Logger,
} from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { JwtVerificationService } from '../jwt-verification.service'

export const AUTH_USER_KEY = 'auth_user'

export interface AuthenticatedUser {
  id: string
  email: string
  role: string
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

  constructor(private readonly jwtVerification: JwtVerificationService) {}

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

      // Attach user to request for downstream use
      ;(request as unknown as Record<string, unknown>)[AUTH_USER_KEY] = user

      return true
    } catch (error) {
      if (error instanceof UnauthorizedException) {
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
