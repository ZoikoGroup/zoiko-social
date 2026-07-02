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
  REDIS_URL: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
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
}
