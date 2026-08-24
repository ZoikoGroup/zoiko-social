import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import compress from '@fastify/compress'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { ConfigService } from './modules/config/config.service'
import { initSentry, captureServerError, closeSentry, isSentryEnabled } from './observability/sentry'

async function bootstrap(): Promise<void> {
  // Before anything else, so a failure during startup is still reported. Reads
  // process.env directly rather than ConfigService, which does not exist yet;
  // dotenv/config is imported at the top of this file. No DSN, no-op.
  initSentry({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV ?? 'development',
    release: process.env.GIT_SHA,
  })

  // ── Crash safety net ──────────────────────────────────────────────────────
  // Node ≥15 kills the process on any unhandled promise rejection. A single
  // floating promise that rejects (e.g. a best-effort Redis write while the
  // provider is over quota) must degrade to a log line, not take down the API
  // — this exact failure mode crashed production repeatedly (Render then
  // rolled back / 502'd while the process restarted).
  process.on('unhandledRejection', (reason) => {
    const msg = reason instanceof Error ? (reason.stack ?? reason.message) : String(reason)
    new Logger('UnhandledRejection').error(msg)
    // These are the ones that used to take the process down, so they are worth
    // reporting even though they carry no request context.
    captureServerError(reason, {
      requestId: 'unhandled-rejection',
      method: '-',
      url: 'process',
    })
  })

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true }),
  )

  const logger = new Logger('Bootstrap')
  const config = app.get(ConfigService)

  // ── Response compression (gzip/brotli) — ~70% smaller JSON payloads ──────
  // Cast: @fastify/compress ships types against its own fastify minor,
  // which TS treats as a different instance type. Runtime-compatible.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await app.register(compress as any, { global: true, threshold: 1024 })

  /*
   * ── Security headers ─────────────────────────────────────────────────────
   *
   * Three that matter for an API answering a browser, added by hand rather than
   * by pulling in helmet: everything helmet adds beyond these is about HTML this
   * server never returns, and a Content-Security-Policy set here would be a
   * second, conflicting source of truth alongside the web app's own.
   *
   * nosniff is the load-bearing one. Without it a browser may decide a JSON
   * response is really HTML or script and run it, which turns any endpoint that
   * echoes user-supplied text into a place to host something executable.
   */
  app.getHttpAdapter().getInstance().addHook('onSend', (_req, reply, payload, done) => {
    void reply.header('X-Content-Type-Options', 'nosniff')
    // Nothing here is meant to be framed; the API returns no UI.
    void reply.header('X-Frame-Options', 'DENY')
    // Keeps ids in a path out of the Referer header on any onward request.
    void reply.header('Referrer-Policy', 'no-referrer')
    done(null, payload)
  })

  // ── Worker-only mode ─────────────────────────────────────────────────────
  // When ENABLE_WORKERS=true, only background workers run. The HTTP server
  // is NOT started, so multiple worker containers can coexist without port
  // conflicts. This is the same Docker image — the env var determines the role.
  //
  // When ENABLE_WORKERS=false (or unset), the HTTP API starts normally and
  // workers are skipped (controlled per-worker in their onModuleInit).
  if (config.env.ENABLE_WORKERS === true) {
    logger.log('ENABLE_WORKERS=true — worker-only mode (no HTTP server)')
    // Keep the process alive — BullMQ workers use Redis connections that keep
    // the event loop active. NestJS will keep running until SIGTERM.
    await new Promise(() => {})
    return
  }

  // ── CORS ─────────────────────────────────────────────────────────────────
  // @fastify/cors only allows GET,HEAD,POST by default — PUT/DELETE/PATCH
  // must be declared explicitly or browser preflights fail.
  app.enableCors({
    origin: config.allowedOrigin,
    credentials: true,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })

  // ── Global API prefix ────────────────────────────────────────────────────
  app.setGlobalPrefix('api/v1')

  // ── Preserve the raw request body for Stripe webhook signature verification ──
  // app.init() registers Nest's default Fastify body parsers; must run first,
  // or our override collides with Nest's own `addContentTypeParser` call for
  // 'application/json' ("Content type parser already present"). We remove and
  // replace it so every request also gets `request.rawBody` (a Buffer)
  // attached — `request.body` still parses as JSON exactly as before for
  // every other route. Only the Stripe webhook controller reads rawBody.
  await app.init()
  const fastifyInstance = app.getHttpAdapter().getInstance()
  fastifyInstance.removeContentTypeParser('application/json')
  fastifyInstance.addContentTypeParser(
    'application/json',
    { parseAs: 'buffer' },
    (req: unknown, body: Buffer, done: (err: Error | null, result?: unknown) => void) => {
      ;(req as { rawBody?: Buffer }).rawBody = body
      try {
        done(null, body.length ? JSON.parse(body.toString('utf8')) : {})
      } catch (err) {
        done(err as Error, undefined)
      }
    },
  )

  // ── Start server ─────────────────────────────────────────────────────────
  const port = config.port
  await app.listen(port, '::')

  logger.log(`ZoikoSocial API running on http://localhost:${port}/api/v1`)
  logger.log(`Environment: ${config.nodeEnv}`)
  logger.log(
    isSentryEnabled()
      ? 'Error reporting active (SENTRY_DSN set)'
      : 'Error reporting inactive — set SENTRY_DSN to enable',
  )

  // Without a flush, an event queued microseconds before exit is lost — which is
  // precisely the event explaining why the process exited.
  for (const signal of ['SIGTERM', 'SIGINT'] as const) {
    process.once(signal, () => {
      void closeSentry().finally(() => process.exit(0))
    })
  }
}

void bootstrap()
