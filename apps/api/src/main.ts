import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
import compress from '@fastify/compress'
import { AppModule } from './app.module'
import { Logger } from '@nestjs/common'
import { ConfigService } from './modules/config/config.service'

async function bootstrap(): Promise<void> {
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

  // ── Start server ─────────────────────────────────────────────────────────
  const port = config.port
  await app.listen(port, '0.0.0.0')

  logger.log(`ZoikoSocial API running on http://localhost:${port}/api/v1`)
  logger.log(`Environment: ${config.nodeEnv}`)
}

void bootstrap()
