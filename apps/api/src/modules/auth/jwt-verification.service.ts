import { Injectable, Inject, Logger, UnauthorizedException } from '@nestjs/common'
import { createRemoteJWKSet, jwtVerify } from 'jose'
import { SUPABASE_ADMIN_CLIENT } from '../database/database.providers'
import type { SupabaseAdminClient } from '../database/database.providers'
import { ConfigService } from '../config/config.service'
import type { AuthenticatedUser } from './guards/jwt-auth.guard'

/**
 * JwtVerificationService — local JWT verification using Supabase JWKS.
 *
 * Primary path:   jose.jwtVerify() with automatically-cached JWKS from Supabase
 * Fallback path:  supabase.auth.getUser() if JWKS is unavailable or verification fails
 *
 * JWKS keys are cached in-memory by jose's createRemoteJWKSet with automatic
 * refresh based on Cache-Control headers and unknown key ID detection.
 * No network request during normal authentication after initial JWKS fetch.
 */
@Injectable()
export class JwtVerificationService {
  private readonly logger = new Logger(JwtVerificationService.name)
  private readonly JWKS: ReturnType<typeof createRemoteJWKSet> | null = null

  constructor(
    private readonly config: ConfigService,
    @Inject(SUPABASE_ADMIN_CLIENT)
    private readonly supabaseAdmin: SupabaseAdminClient,
  ) {
    try {
      const jwksUrl = `${config.supabaseUrl}/auth/v1/.well-known/jwks.json`
      this.JWKS = createRemoteJWKSet(new URL(jwksUrl))
      this.logger.log(`JWKS remote set initialised from ${jwksUrl}`)
    } catch (err) {
      this.logger.error(`Failed to initialise JWKS: ${(err as Error).message}`)
    }
  }

  /**
   * Verify a Supabase access token locally using JWKS.
   * Falls back to Supabase auth.getUser() if local verification is unavailable
   * or fails (e.g., network error fetching JWKS, unknown key).
   */
  async verify(token: string): Promise<AuthenticatedUser> {
    // ── Primary: local JWT verification via JOSE + JWKS ──────────────────────
    if (this.JWKS) {
      try {
        const { payload } = await jwtVerify(token, this.JWKS, {
          issuer: `${this.config.supabaseUrl}/auth/v1`,
          audience: 'authenticated',
        })

        return {
          id: payload.sub as string,
          email: (payload.email as string) ?? '',
          role: (payload.role as string) ?? 'authenticated',
        }
      } catch (err) {
        this.logger.warn(`Local JWT verification failed, falling back to Supabase: ${(err as Error).message}`)
      }
    }

    // ── Fallback: Supabase auth.getUser() ────────────────────────────────────
    const { data, error } = await this.supabaseAdmin.auth.getUser(token)
    if (error || !data.user) {
      throw new UnauthorizedException({
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired authorization token',
      })
    }

    return {
      id: data.user.id,
      email: data.user.email || '',
      role: data.user.role || 'authenticated',
    }
  }
}
