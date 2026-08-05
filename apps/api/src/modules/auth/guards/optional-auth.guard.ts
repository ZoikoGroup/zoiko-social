import { Injectable, ExecutionContext } from '@nestjs/common'
import { JwtAuthGuard } from './jwt-auth.guard'

/** Marks a request as having passed through OptionalAuthGuard. */
export const OPTIONAL_AUTH_KEY = '__optionalAuth'

/**
 * OptionalAuthGuard works like JwtAuthGuard but does NOT throw if no token is
 * present. Use this for endpoints that work for both authenticated and anonymous
 * users. When authenticated, the user is available via the @CurrentUser()
 * decorator; when not, that decorator yields undefined.
 *
 * The request is flagged so @CurrentUser() knows an absent user is expected here.
 * Without the flag the decorator throws — and it must keep doing that on a route
 * with no guard at all, where the throw is the only thing standing between an
 * anonymous caller and a handler written to assume a user.
 */
@Injectable()
export class OptionalAuthGuard extends JwtAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Record<string, unknown>>()
    request[OPTIONAL_AUTH_KEY] = true
    try {
      return await super.canActivate(context)
    } catch {
      return true
    }
  }
}
