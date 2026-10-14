import { Module, Logger } from '@nestjs/common'
import { ConfigModule } from '../config/config.module'
import { ConfigService } from '../config/config.service'
import { DatabaseModule } from '../database/database.module'
import { PrismaModule } from '../prisma/prisma.module'
import { CommsDecisionService } from './comms-decision.service'
import { CommsLedgerService } from './comms-ledger.service'
import { CommsSuppressionService } from './comms-suppression.service'
import { CommsService } from './comms.service'
import { ConsoleEmailProvider, EmailProvider, ResendEmailProvider } from './delivery/email-provider'
import { ProviderWebhookController } from './delivery/provider-webhook.controller'

/**
 * Communications platform (ZS-COMMS-EMAIL-001).
 *
 * The provider is chosen once, here, from configuration. Everything downstream
 * depends on the abstract EmailProvider, so switching vendors — or falling back
 * when a key is missing — never reaches the templates or the dispatcher.
 */
@Module({
  imports: [ConfigModule, PrismaModule, DatabaseModule],
  controllers: [ProviderWebhookController],
  providers: [
    CommsDecisionService,
    CommsLedgerService,
    CommsSuppressionService,
    CommsService,
    ConsoleEmailProvider,
    ResendEmailProvider,
    {
      provide: EmailProvider,
      useFactory: (config: ConfigService, resend: ResendEmailProvider, console: ConsoleEmailProvider) => {
        const logger = new Logger('CommsModule')
        if (config.emailSendingEnabled) {
          logger.log(`Email delivery active: Resend (sender: ${config.emailFrom('transactional')})`)
          return resend
        }
        logger.warn('Email delivery inactive: RESEND_API_KEY missing or EMAIL_PROVIDER=console (using Console provider)')
        return console
      },
      inject: [ConfigService, ResendEmailProvider, ConsoleEmailProvider],
    },
  ],
  exports: [CommsService, CommsDecisionService, CommsLedgerService, CommsSuppressionService, EmailProvider],
})
export class CommsModule {}
