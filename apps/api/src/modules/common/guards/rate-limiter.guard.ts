import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { FastifyRequest } from 'fastify'
import { RateLimiterService } from '../../redis/rate-limiter.service'
import { RATE_LIMIT_KEY, type RateLimitMetadata } from '../decorators/rate-limit.decorator'

/**
 * RateLimiterGuard — configurable sliding-window rate limiter.
 *
 * Default global limits apply when no @RateLimit() decorator is present.
 *
 * Per-route limits can be set with:
 *   @RateLimit({ limit: 10, windowSeconds: 60 })
 *
 * Graceful degradation: if Redis is unavailable, all requests pass through.
 */
/**
 * In-process fixed-window counter for read-only requests. Per-instance rather
 * than global, which is acceptable for GETs: the goal is abuse ceiling, not
 * precise accounting — and it removes a guaranteed Redis round-trip from
 * every read. Writes/auth/search keep the shared Redis limiter.
 */
class LocalWindowLimiter {
  private readonly windows = new Map<string, { count: number; resetAt: number }>()
  private lastSweep = 0

  check(key: string, limit: number, windowSeconds: number): boolean {
    const now = Date.now()

    // Periodic sweep so the map doesn't grow unbounded
    if (now - this.lastSweep > 60_000) {
      for (const [k, w] of this.windows) {
        if (w.resetAt <= now) this.windows.delete(k)
      }
      this.lastSweep = now
    }

    const entry = this.windows.get(key)
    if (!entry || entry.resetAt <= now) {
      this.windows.set(key, { count: 1, resetAt: now + windowSeconds * 1000 })
      return true
    }
    entry.count++
    return entry.count <= limit
  }
}

@Injectable()
export class RateLimiterGuard implements CanActivate {
  private readonly logger = new Logger(RateLimiterGuard.name)
  private readonly localLimiter = new LocalWindowLimiter()

  // Default global limits
  private readonly defaults = {
    global: { limit: 100, windowSeconds: 60 },
    login: { limit: 10, windowSeconds: 60 },
    register: { limit: 5, windowSeconds: 300 },
    follow: { limit: 30, windowSeconds: 60 },
    unfollow: { limit: 30, windowSeconds: 60 },
    search: { limit: 20, windowSeconds: 60 },
    profileUpdate: { limit: 10, windowSeconds: 60 },
    forgotPassword: { limit: 3, windowSeconds: 300 },
    refresh: { limit: 10, windowSeconds: 60 },
    verification: { limit: 5, windowSeconds: 300 },
  }

  constructor(
    private readonly reflector: Reflector,
    private readonly rateLimiter: RateLimiterService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<FastifyRequest>()

    // Extract identifier: authenticated user ID or IP fallback
    const userId = (request as unknown as Record<string, unknown>).auth_user
      ? ((request as unknown as Record<string, unknown>).auth_user as { id: string }).id
      : undefined
    const ip = request.ip ?? request.socket?.remoteAddress ?? 'unknown'
    const identifier = userId ?? ip

    // Determine the route name for limit lookup
    const handler = context.getHandler()
    const controller = context.getClass()
    const customMetadata = this.reflector.get<RateLimitMetadata | undefined>(
      RATE_LIMIT_KEY,
      handler,
    )

    if (customMetadata) {
      const prefix = customMetadata.prefix ?? this.getRoutePrefix(controller, handler)
      const result = await this.rateLimiter.assert(
        prefix,
        identifier,
        customMetadata.limit,
        customMetadata.windowSeconds,
      )
      if (!result.allowed) {
        this.throwRateLimited(result)
      }
      return true
    }

    const routeLimit = this.getRouteLimit(request)
    const method = request.method ?? 'GET'

    // ── Read-only GETs: in-process limiter — ZERO Redis round-trips ────────
    // (search still goes through Redis below: it's the GET attackers hammer)
    if ((method === 'GET' || method === 'HEAD') && !routeLimit) {
      const allowed = this.localLimiter.check(
        `get:${identifier}`,
        this.defaults.global.limit * 3, // per-instance window, so a looser ceiling
        this.defaults.global.windowSeconds,
      )
      if (!allowed) {
        this.throwRateLimited({ remaining: 0, resetTime: 0, total: this.defaults.global.limit * 3 })
      }
      return true
    }

    // ── Writes / auth / search: global + per-route in ONE Redis round-trip ─
    const checks: { prefix: string; identifier: string; limit: number; windowSeconds: number }[] = [
      { prefix: 'global', identifier, ...this.defaults.global },
    ]
    if (routeLimit) {
      checks.push({ prefix: routeLimit.prefix, identifier, limit: routeLimit.limit, windowSeconds: routeLimit.windowSeconds })
    }

    const results = await this.rateLimiter.checkMany(checks)
    for (const result of results) {
      if (!result.allowed) {
        this.throwRateLimited(result)
      }
    }

    return true
  }

  private getRoutePrefix(
    controller: { name: string },
    handler: { name: string },
  ): string {
    const controllerName = controller.name.replace(/Controller$/, '').toLowerCase()
    const handlerName = handler.name.toLowerCase()
    return `${controllerName}.${handlerName}`
  }

  private getRouteLimit(request: FastifyRequest): { limit: number; windowSeconds: number; prefix: string } | null {
    const url = request.url ?? ''
    const method = request.method ?? 'GET'

    // Health check — exempt from tracking
    if (url.includes('/health')) return null

    // Match by URL path pattern (more reliable than handler names)
    if (url.match(/\/auth\/login/))      return { ...this.defaults.login, prefix: 'login' }
    if (url.match(/\/auth\/register/))   return { ...this.defaults.register, prefix: 'register' }
    if (url.match(/\/auth\/forgot-password/)) return { ...this.defaults.forgotPassword, prefix: 'forgot-password' }
    if (url.match(/\/auth\/refresh/))    return { ...this.defaults.refresh, prefix: 'refresh' }
    if (url.match(/\/profiles\/me\/(professional|verification)/) && method !== 'GET') {
      return { ...this.defaults.verification, prefix: 'profiles.write' }
    }
    if (url.match(/\/profiles\/me/) && method === 'PUT') {
      return { ...this.defaults.profileUpdate, prefix: 'profile.update' }
    }

    // Network actions
    if (url.match(/\/network\/follow\/[^/]+$/) && method === 'POST') {
      return { ...this.defaults.follow, prefix: 'network.follow' }
    }
    if (url.match(/\/network\/follow\/[^/]+$/) && method === 'DELETE') {
      return { ...this.defaults.unfollow, prefix: 'network.unfollow' }
    }
    if (url.match(/\/network\/search/)) return { ...this.defaults.search, prefix: 'network.search' }

    return null
  }

  private throwRateLimited(result: { remaining: number; resetTime: number; total: number }): never {
    throw new HttpException(
      {
        success: false,
        error: {
          code: 'RATE_LIMITED',
          message: 'Too many requests. Please try again later.',
          remaining: result.remaining,
          resetTime: result.resetTime,
        },
      },
      HttpStatus.TOO_MANY_REQUESTS,
    )
  }
}
