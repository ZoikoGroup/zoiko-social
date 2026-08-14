import { createParamDecorator, type ExecutionContext } from '@nestjs/common'

/**
 * The raw Bearer token from the request.
 *
 * Needed because Supabase's admin API revokes sessions by JWT, not by user id:
 * `admin.signOut(jwt, scope)` is documented as taking "a valid, logged-in JWT",
 * and there is no revoke-by-id anywhere in GoTrueAdminApi. Passing a user id
 * there fails, which is what made every logout return LOGOUT_FAILED.
 *
 * JwtAuthGuard has already verified this token by the time a handler runs, so
 * anything reading it is working with a checked value.
 */
export const AccessToken = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<{ headers: Record<string, string | undefined> }>()
    const header = request.headers['authorization']
    if (!header?.startsWith('Bearer ')) return undefined
    return header.slice('Bearer '.length) || undefined
  },
)
