import { Injectable, ExecutionContext } from '@nestjs/common'
import { JwtAuthGuard } from './jwt-auth.guard'

/**
 * OptionalAuthGuard works like JwtAuthGuard but does NOT throw if no token is present.
 * Use this for endpoints that work for both authenticated and anonymous users.
 * When authenticated, the user is available via @CurrentUser() decorator.
 */
@Injectable()
export class OptionalAuthGuard extends JwtAuthGuard {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      return await super.canActivate(context)
    } catch {
      return true
    }
  }
}
