import {
  Injectable,
  Inject,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  Logger,
} from '@nestjs/common'
import { SUPABASE_ADMIN_CLIENT } from '../database/database.providers'
import type { SupabaseAdminClient } from '../database/database.providers'
import { ConfigService } from '../config/config.service'
import { PrismaService } from '../prisma/prisma.service'
import { AuditLogService } from '../common/audit-log/audit-log.service'
import { RedisService } from '../redis/redis.service'

type OAuthProvider = 'google' | 'apple' | 'facebook'

const OAUTH_PROVIDER_LABELS: Record<OAuthProvider, string> = {
  google: 'Google',
  apple: 'Apple',
  facebook: 'Facebook',
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  /** Providers confirmed enabled on the Supabase project. Positive results only. */
  private readonly enabledOAuthProviders = new Set<OAuthProvider>()

  constructor(
    @Inject(SUPABASE_ADMIN_CLIENT)
    private readonly supabaseAdmin: SupabaseAdminClient,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly auditLog: AuditLogService,
    private readonly redis: RedisService,
  ) {}

  async register(email: string, password: string, displayName?: string) {
    const { data: authData, error: authError } = await this.supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: displayName ? { full_name: displayName } : undefined,
    })

    if (authError) {
      if (authError.message?.includes('already registered')) {
        throw new ConflictException({
          code: 'EMAIL_EXISTS',
          message: 'An account with this email already exists',
        })
      }
      this.logger.error(`Registration failed: ${authError.message}`)
      throw new UnauthorizedException({
        code: 'REGISTRATION_FAILED',
        message: authError.message,
      })
    }

    if (!authData.user) {
      throw new UnauthorizedException({
        code: 'REGISTRATION_FAILED',
        message: 'Failed to create user',
      })
    }

    return {
      id: authData.user.id,
      email: authData.user.email,
    }
  }

  /**
   * Sign in with email, username, or phone number.
   * Usernames are resolved server-side so the username→email mapping is
   * never exposed to clients before a successful password check.
   */
  async login(identifier: string, password: string) {
    const trimmed = identifier.trim()
    const invalidCredentials = new UnauthorizedException({
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid credentials',
    })

    let credentials: { email: string; password: string } | { phone: string; password: string }

    if (trimmed.includes('@')) {
      credentials = { email: trimmed.toLowerCase(), password }
    } else if (/^\+?[0-9()\s-]{7,20}$/.test(trimmed)) {
      credentials = { phone: trimmed.replace(/[()\s-]/g, ''), password }
    } else {
      // Username → resolve to the account's email
      const profile = await this.prisma.profile.findUnique({
        where: { username: trimmed.toLowerCase() },
        select: { id: true },
      })

      if (!profile) throw invalidCredentials

      const { data: userData, error: userError } = await this.supabaseAdmin.auth.admin.getUserById(profile.id)
      if (userError || !userData.user?.email) throw invalidCredentials

      credentials = { email: userData.user.email, password }
    }

    const { data, error } = await this.supabaseAdmin.auth.signInWithPassword(credentials)

    if (error || !data.session) {
      throw invalidCredentials
    }

    // Credentials are proven. A hidden account is reported, not restored — the
    // member confirms with POST /auth/reactivate.
    const pendingReactivation = await this.resolveAccountStateOnLogin(data.user.id, invalidCredentials)

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      // Present only when the account is hidden. The session is issued either way
      // so the member can confirm; every other route stays blocked by the guard
      // until they do.
      ...(pendingReactivation ? { pendingReactivation } : {}),
    }
  }

  /**
   * Reports whether a hidden account needs restoring, and purges one that is past
   * its deletion deadline.
   *
   * This used to perform the restore itself, silently: deactivating an account and
   * signing back in undid the deactivation with no acknowledgement, so a member
   * who deactivated deliberately was returned to an active account without being
   * told. The audit log showed deactivate and reactivate seconds apart with no
   * decision in between. It now reports the state and leaves the choice to the
   * member, who confirms it against POST /auth/reactivate.
   *
   *   deactivated       → reported, not restored
   *   pending_deletion  → reported if still inside the grace period, so the member
   *                       can decide whether to cancel the deletion
   *   grace expired     → purged here and now, then treated as non-existent. Doing
   *                       it at this point matters: the daily job may not have run
   *                       (it depends on Redis), and an account past its deadline
   *                       must not be recoverable just because a queue was down.
   *
   * Suspended and banned are deliberately untouched — a moderator's decision is
   * not something signing in should undo. The guard blocks them on the next call.
   *
   * Lives here rather than in ProfileService because ProfileService injects this
   * service; calling back into it would be a circular dependency.
   */
  private async resolveAccountStateOnLogin(
    userId: string,
    invalidCredentials: Error,
  ): Promise<{ state: 'deactivated' | 'pending_deletion'; since: string } | null> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: userId },
      select: { username: true, state: true, deactivatedAt: true, deletionRequestedAt: true },
    })
    if (!profile) return null
    if (profile.state !== 'deactivated' && profile.state !== 'pending_deletion') return null

    if (profile.state === 'pending_deletion') {
      const graceDays = this.config.env.ACCOUNT_DELETION_GRACE_DAYS ?? 30
      const requestedAt = profile.deletionRequestedAt?.getTime() ?? 0
      const deadline = requestedAt + graceDays * 86_400_000

      if (requestedAt > 0 && Date.now() > deadline) {
        this.logger.log(`Login for ${userId} arrived after the deletion deadline — purging now`)
        try {
          await this.deleteAccount(userId)
          await this.auditLog.record({
            actorId: null,
            action: 'account.delete',
            entityType: 'profile',
            entityId: userId,
            newData: { username: profile.username, deletedBy: 'grace_period_expired' },
          })
        } catch (err) {
          this.logger.error(`Purge on expired login failed for ${userId}: ${(err as Error).message}`)
        }
        throw invalidCredentials
      }
    }

    // Report only. The member confirms via POST /auth/reactivate.
    const since = (
      profile.state === 'pending_deletion' ? profile.deletionRequestedAt : profile.deactivatedAt
    )?.toISOString()

    return { state: profile.state, since: since ?? new Date().toISOString() }
  }

  /**
   * Restores the caller's own account, on their explicit confirmation.
   *
   * Reachable while the account is still hidden because the route carries
   * @AllowInactiveAccount() — JwtAuthGuard would otherwise refuse it, which is the
   * reason this had to happen silently inside login before.
   *
   * Idempotent: an already-active account returns the same shape rather than
   * failing, so a double-tap on the confirm button cannot error. Moderator states
   * are refused — the guard stops suspended and banned before this runs, and the
   * explicit check keeps that true if the annotation is ever widened.
   */
  async reactivate(userId: string): Promise<{ state: string; reactivated: boolean }> {
    const profile = await this.prisma.profile.findUnique({
      where: { id: userId },
      select: { username: true, state: true },
    })
    if (!profile) throw new UnauthorizedException({ code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' })
    if (profile.state === 'active') return { state: 'active', reactivated: false }
    if (profile.state !== 'deactivated' && profile.state !== 'pending_deletion') {
      throw new ForbiddenException({
        code: 'ACCOUNT_NOT_RESTORABLE',
        message: 'This account cannot be restored.',
      })
    }

    await this.prisma.profile.update({
      where: { id: userId },
      data: { state: 'active', deactivatedAt: null, deletionRequestedAt: null },
    })
    // The cached profile still says deactivated, and the profile read gates on
    // state — so without this the account comes back but its page keeps answering
    // 404 until the entry expires. ProfileService.afterStateChange does this on
    // the way out; this is the matching step on the way back in. Cannot reuse that
    // helper: ProfileModule imports AuthModule, so depending on it here would be
    // circular. RedisModule is @Global.
    await this.redis.invalidateProfile(userId)
    await this.redis.invalidateUsername(profile.username)
    await this.auditLog.record({
      actorId: userId,
      action: profile.state === 'pending_deletion' ? 'account.deletion_cancelled' : 'account.reactivate',
      entityType: 'profile',
      entityId: userId,
      newData: { username: profile.username, from: profile.state, confirmedByMember: true },
    })
    this.logger.log(`Account restored on request for ${userId} (was ${profile.state})`)
    return { state: 'active', reactivated: true }
  }

  /**
   * Ends every session for the caller.
   *
   * Takes the caller's JWT, not their id: admin.signOut is documented as taking
   * "a valid, logged-in JWT" and GoTrueAdminApi has no revoke-by-id at all. This
   * was passing a user id, so Supabase rejected every call and logout always
   * answered LOGOUT_FAILED — which also meant deactivating an account never
   * actually signed the other devices out.
   *
   * Scope 'global' rather than the default, since the point is other devices.
   */
  async logout(accessToken: string | undefined) {
    if (!accessToken) {
      throw new UnauthorizedException({
        code: 'LOGOUT_FAILED',
        message: 'Failed to log out',
      })
    }

    const { error } = await this.supabaseAdmin.auth.admin.signOut(accessToken, 'global')
    if (error) {
      this.logger.error(`Logout failed: ${error.message}`)
      throw new UnauthorizedException({
        code: 'LOGOUT_FAILED',
        message: 'Failed to log out',
      })
    }
  }

  async forgotPassword(email: string) {
    const redirectUrl = `${this.config.allowedOrigin}/reset-password`
    const { error } = await this.supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl,
    })

    if (error) {
      this.logger.error(`Forgot password failed for ${email}: ${error.message}`)
      throw new BadRequestException({
        code: 'FORGOT_PASSWORD_FAILED',
        message: 'Failed to send password reset email',
      })
    }
  }

  async resetPassword(accessToken: string, newPassword: string) {
    const { data: userData, error: verifyError } = await this.supabaseAdmin.auth.getUser(accessToken)

    if (verifyError || !userData.user) {
      throw new UnauthorizedException({
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired reset token',
      })
    }

    const { error: updateError } = await this.supabaseAdmin.auth.admin.updateUserById(
      userData.user.id,
      { password: newPassword },
    )

    if (updateError) {
      this.logger.error(`Reset password failed for user ${userData.user.id}: ${updateError.message}`)
      throw new BadRequestException({
        code: 'RESET_PASSWORD_FAILED',
        message: 'Failed to reset password',
      })
    }
  }

  async getGoogleOAuthUrl() {
    return this.getOAuthUrl('google')
  }

  async getOAuthUrl(provider: OAuthProvider) {
    const redirectUrl = `${this.config.allowedOrigin}/auth/callback`
    // Offline access / forced consent are Google-specific; other providers reject them.
    const queryParams =
      provider === 'google' ? { access_type: 'offline', prompt: 'consent' } : undefined

    const { data, error } = await this.supabaseAdmin.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl,
        ...(queryParams ? { queryParams } : {}),
      },
    })

    if (error || !data.url) {
      this.logger.error(`${provider} OAuth URL generation failed: ${error?.message}`)
      throw new BadRequestException({
        code: 'OAUTH_FAILED',
        message: `Failed to generate ${provider} OAuth URL`,
      })
    }

    await this.assertProviderEnabled(provider, data.url)

    return { url: data.url }
  }

  /**
   * Supabase happily builds an authorize URL for any provider it recognises by
   * name — it only rejects a *disabled* one when the URL is actually visited.
   * So without this check we answer 200 with a URL that answers 400, and the
   * caller sends the visitor off to a raw GoTrue JSON error page with no way back.
   *
   * Visiting /authorize is side-effect free for our URLs: we pass no
   * code_challenge, so GoTrue records no flow state and just redirects.
   */
  private async assertProviderEnabled(provider: OAuthProvider, url: string) {
    if (this.enabledOAuthProviders.has(provider)) return

    let status: number
    try {
      const res = await fetch(url, { redirect: 'manual' })
      status = res.status
    } catch (err) {
      // Our own probe couldn't reach Supabase. That's no reason to block a
      // sign-in that might well have worked — let the caller through.
      this.logger.warn(
        `${provider} OAuth preflight could not reach Supabase: ${err instanceof Error ? err.message : String(err)}`,
      )
      return
    }

    if (status >= 300 && status < 400) {
      // Only enabled results are remembered, so turning a provider on in the
      // Supabase dashboard takes effect without restarting the API.
      this.enabledOAuthProviders.add(provider)
      return
    }

    this.logger.warn(
      `${provider} OAuth is not enabled on the Supabase project (authorize returned ${status})`,
    )
    throw new BadRequestException({
      code: 'OAUTH_PROVIDER_DISABLED',
      message: `${OAUTH_PROVIDER_LABELS[provider]} sign-in is not available right now.`,
    })
  }

  async handleOAuthCallback(code: string) {
    const { data, error } = await this.supabaseAdmin.auth.exchangeCodeForSession(code)

    if (error || !data.session) {
      this.logger.error(`OAuth callback failed: ${error?.message}`)
      throw new UnauthorizedException({
        code: 'OAUTH_CALLBACK_FAILED',
        message: 'Failed to complete sign-in',
      })
    }

    // Same report-on-sign-in behaviour as password login.
    const pendingReactivation = await this.resolveAccountStateOnLogin(
      data.user.id,
      new UnauthorizedException({ code: 'OAUTH_CALLBACK_FAILED', message: 'Failed to complete sign-in' }),
    )

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      ...(pendingReactivation ? { pendingReactivation } : {}),
    }
  }

  async getProfile(userId: string) {
    const { data: profile, error } = await this.supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !profile) {
      this.logger.error(`Profile fetch failed for user ${userId}: ${error?.message}`)
      throw new UnauthorizedException({
        code: 'PROFILE_NOT_FOUND',
        message: 'User profile not found',
      })
    }

    return profile
  }

  /**
   * Permanently delete a user from Supabase Auth.
   * Called during account deletion — this is the irreversible step.
   */
  async deleteAccount(userId: string): Promise<void> {
    const { error } = await this.supabaseAdmin.auth.admin.deleteUser(userId)
    if (error) {
      this.logger.error(`Account deletion failed for user ${userId}: ${error.message}`)
      throw new BadRequestException({
        code: 'ACCOUNT_DELETION_FAILED',
        message: 'Failed to delete account',
      })
    }
    this.logger.log(`User ${userId} deleted from Supabase Auth`)
  }

  async refreshToken(refreshToken: string) {
    const { data, error } = await this.supabaseAdmin.auth.refreshSession({
      refresh_token: refreshToken,
    })

    if (error || !data.session) {
      throw new UnauthorizedException({
        code: 'REFRESH_FAILED',
        message: 'Invalid or expired refresh token',
      })
    }

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
    }
  }
}
