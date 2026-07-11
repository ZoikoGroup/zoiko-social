import { Controller, Get } from '@nestjs/common'
import { HealthCheck, HealthCheckService } from '@nestjs/terminus'

@Controller('health')
export class HealthController {
  constructor(private health: HealthCheckService) {}

  @Get()
  @HealthCheck()
  check() {
    return this.health.check([])
  }

  /**
   * Which build is actually running — GIT_SHA is baked into the Docker image
   * at build time. The deploy workflow polls this after triggering Render to
   * verify the new build really went live (Render rolls back silently on
   * failed deploys, and GitHub can't see that).
   */
  @Get('version')
  version() {
    return {
      sha: process.env.GIT_SHA ?? 'unknown',
      startedAt: STARTED_AT,
    }
  }
}

const STARTED_AT = new Date().toISOString()
