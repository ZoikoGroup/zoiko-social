import { Injectable, Logger } from '@nestjs/common'
import { z } from 'zod'

const envSchema = z.object({
  PORT: z.coerce.number().default(4000),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_ANON_KEY: z.string().min(1),
  JWT_SECRET: z.string().min(1).optional(),
  INTERNAL_API_SECRET: z.string().min(1).optional(),
  ALLOWED_ORIGIN: z.string().default('http://localhost:3000'),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().optional(),
  ENABLE_WORKERS: z.string().optional().transform((v) => v === undefined ? undefined : v === 'true'),
  NOTIFICATION_RETENTION_DAYS: z.coerce.number().int().positive().default(90).optional(),
  SENTRY_DSN: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  // Cloudflare R2 (S3-compatible). When all are set, story media uses R2; else Supabase Storage.
  R2_PUBLIC_URL: z.string().url().optional(),
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET: z.string().optional(),
})

export type Env = z.infer<typeof envSchema>

@Injectable()
export class ConfigService {
  private readonly logger = new Logger(ConfigService.name)
  readonly env: Env

  constructor() {
    const result = envSchema.safeParse(process.env)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      this.logger.error('Invalid environment variables', JSON.stringify(errors, null, 2))
      throw new Error(`Environment validation failed: ${JSON.stringify(errors)}`)
    }
    this.env = result.data
  }

  get port(): number {
    return this.env.PORT
  }

  get nodeEnv(): string {
    return this.env.NODE_ENV
  }

  get isProduction(): boolean {
    return this.env.NODE_ENV === 'production'
  }

  get supabaseUrl(): string {
    return this.env.SUPABASE_URL
  }

  get supabaseServiceRoleKey(): string {
    return this.env.SUPABASE_SERVICE_ROLE_KEY
  }

  get supabaseAnonKey(): string {
    return this.env.SUPABASE_ANON_KEY
  }

  get jwtSecret(): string | undefined {
    return this.env.JWT_SECRET
  }

  get internalApiSecret(): string | undefined {
    return this.env.INTERNAL_API_SECRET
  }

  get allowedOrigin(): string {
    return this.env.ALLOWED_ORIGIN
  }

  get redisUrl(): string | undefined {
    return this.env.REDIS_URL
  }

  get r2AccountId(): string | undefined {
    return this.env.R2_ACCOUNT_ID
  }

  get r2AccessKeyId(): string | undefined {
    return this.env.R2_ACCESS_KEY_ID
  }

  get r2SecretAccessKey(): string | undefined {
    return this.env.R2_SECRET_ACCESS_KEY
  }

  get r2Bucket(): string | undefined {
    return this.env.R2_BUCKET
  }

  get r2PublicUrl(): string | undefined {
    return this.env.R2_PUBLIC_URL
  }

  get r2Endpoint(): string | undefined {
    const accountId = this.env.R2_ACCOUNT_ID
    return accountId ? `https://${accountId}.r2.cloudflarestorage.com` : undefined
  }

  /** True when all R2 credentials are configured — story media then uses R2. */
  get r2Enabled(): boolean {
    return !!(
      this.env.R2_ACCOUNT_ID &&
      this.env.R2_ACCESS_KEY_ID &&
      this.env.R2_SECRET_ACCESS_KEY &&
      this.env.R2_BUCKET &&
      this.env.R2_PUBLIC_URL
    )
  }
}
