import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { ConfigModule } from '../config/config.module'
import { PrismaModule } from '../prisma/prisma.module'
import { NotificationPreferenceService } from './notification-preference.service'
import { PushController } from './push.controller'
import { PushService } from './push.service'

/**
 * Web Push.
 *
 * Exported rather than kept private because the notification write path needs
 * both halves: the preference check that decides whether a push is wanted, and
 * the sender that delivers it. Everything else about push — subscribing,
 * unsubscribing, pruning dead endpoints — stays behind this module.
 */
@Module({
  imports: [AuthModule, ConfigModule, PrismaModule],
  controllers: [PushController],
  providers: [PushService, NotificationPreferenceService],
  exports: [PushService, NotificationPreferenceService],
})
export class PushModule {}
