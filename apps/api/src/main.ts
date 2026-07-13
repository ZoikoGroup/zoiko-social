import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import compress from '@fastify/compress'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { ConfigService } from './modules/config/config.service'

async function bootstrap(): Promise<void> {
  // ── Crash safety net ──────────────────────────────────────────────────────
  // Node ≥15 kills the process on any unhandled promise rejection. A single
  // floating promise that rejects (e.g. a best-effort Redis write while the
  // provider is over quota) must degrade to a log line, not take down the API
  // — this exact failure mode crashed production repeatedly (Render then
  // rolled back / 502'd while the process restarted).
  process.on('unhandledRejection', (reason) => {
    const msg = reason instanceof Error ? (reason.stack ?? reason.message) : String(reason)
    new Logger('UnhandledRejection').error(msg)
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
  await app.listen(port, '0.0.0.0')

  logger.log(`ZoikoSocial API running on http://localhost:${port}/api/v1`)
  logger.log(`Environment: ${config.nodeEnv}`)
}

void bootstrap()
