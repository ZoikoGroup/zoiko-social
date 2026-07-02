import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
  Inject,
  Logger,
} from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { SUPABASE_ADMIN_CLIENT } from '../../database/database.providers'
import type { SupabaseAdminClient } from '../../database/database.providers'

export const AUTH_USER_KEY = 'auth_user'

export interface AuthenticatedUser {
  id: string
  email: string
  role: string
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly logger = new Logger(JwtAuthGuard.name)

  constructor(
    @Inject(SUPABASE_ADMIN_CLIENT)
    private readonly supabaseAdmin: SupabaseAdminClient,
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
      const { data, error } = await this.supabaseAdmin.auth.getUser(token)

      if (error || !data.user) {
        throw new UnauthorizedException({
          code: 'INVALID_TOKEN',
          message: 'Invalid or expired authorization token',
        })
      }

      const user: AuthenticatedUser = {
        id: data.user.id,
        email: data.user.email || '',
        role: data.user.role || 'authenticated',
      }

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
