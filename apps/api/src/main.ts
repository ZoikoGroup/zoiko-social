import 'dotenv/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, type NestFastifyApplication } from '@nestjs/platform-fastify'
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

  // ── CORS ─────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: config.allowedOrigin,
    credentials: true,
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
