import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name)

  constructor() {
    super({
      // warn/error only — per-query event logging adds measurable overhead
      log: [
        { emit: 'stdout', level: 'warn' },
        { emit: 'stdout', level: 'error' },
      ],
      // Interactive transactions run several statements; over a remote pooler
      // each statement pays a network RTT, so the 5s default is too tight.
      transactionOptions: {
        maxWait: 10_000,
        timeout: 30_000,
      },
    })
  }

  async onModuleInit(): Promise<void> {
    await this.$connect()
    this.logger.log('Prisma connected to PostgreSQL')
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect()
    this.logger.log('Prisma disconnected')
  }
}
