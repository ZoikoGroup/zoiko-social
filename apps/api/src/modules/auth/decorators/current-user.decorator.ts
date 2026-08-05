import { createParamDecorator, type ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { FastifyRequest } from 'fastify'
import { AUTH_USER_KEY, type AuthenticatedUser } from '../guards/jwt-auth.guard'
import { OPTIONAL_AUTH_KEY } from '../guards/optional-auth.guard'

/**
 * Decorator to extract the current authenticated user from the request.
 *
 * Usage:
 *   @Get('profile')
 *   getProfile(@CurrentUser() user: AuthenticatedUser) { ... }
 *
 *   @Get('profile')
 *   getProfile(@CurrentUser('id') userId: string) { ... }
 *
 * On a route guarded by OptionalAuthGuard this returns undefined for an
 * anonymous caller. Everywhere else an absent user still throws.
 *
 * That distinction matters: this decorator used to throw unconditionally, which
 * silently defeated OptionalAuthGuard on all 62 routes using it — a logged-out
 * visitor got 401 USER_NOT_FOUND from every "public" endpoint, including hashtag
 * pages, event listings and public profiles. The guard swallowed its own error
 * and then the decorator raised a new one.
 */
export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>()
    const raw = request as unknown as Record<string, unknown>
    const user = raw[AUTH_USER_KEY] as AuthenticatedUser | undefined

    if (!user) {
      // Anonymous is a valid state only where a guard has said so.
      if (raw[OPTIONAL_AUTH_KEY] === true) return undefined
      throw new UnauthorizedException({
        code: 'USER_NOT_FOUND',
        message: 'Authenticated user not found in request',
      })
    }

    return data ? user[data] : user
  },
)
