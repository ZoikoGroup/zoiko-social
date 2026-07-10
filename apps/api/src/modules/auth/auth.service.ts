import {
  Injectable,
  Inject,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common'
import { SUPABASE_ADMIN_CLIENT } from '../database/database.providers'
import type { SupabaseAdminClient } from '../database/database.providers'
import { ConfigService } from '../config/config.service'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    @Inject(SUPABASE_ADMIN_CLIENT)
    private readonly supabaseAdmin: SupabaseAdminClient,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
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

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    }
  }

  async logout(userId: string) {
    const { error } = await this.supabaseAdmin.auth.admin.signOut(userId)
    if (error) {
      this.logger.error(`Logout failed for user ${userId}: ${error.message}`)
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

  async getOAuthUrl(provider: 'google' | 'apple' | 'facebook') {
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

    return { url: data.url }
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

    return {
      accessToken: data.session.access_token,
      refreshToken: data.session.refresh_token,
      expiresAt: data.session.expires_at,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
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
