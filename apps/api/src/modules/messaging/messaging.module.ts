import { Module } from '@nestjs/common'
import { MessagingController } from './messaging.controller'
import { MessagingService } from './messaging.service'
import { MessagingGateway } from './messaging.gateway'
import { MessagingQueueModule } from './messaging-queue.module'
import { PresenceService } from './presence.service'
import { ContactService } from './contact.service'
import { MessageRequestService } from './message-request.service'
import { GroupService } from './group.service'
import { AttachmentService } from './attachment.service'
import { ProfessionalMessagingService } from './professional-messaging.service'
import { MessagingPrivacyService } from './messaging-privacy.service'
import { AuthModule } from '../auth/auth.module'
import { R2Module } from '../storage/r2.module'

@Module({
  imports: [
    AuthModule,
    R2Module,
    MessagingQueueModule.forRoot(),
  ],
  controllers: [MessagingController],
  providers: [
    MessagingService,
    MessagingGateway,
    PresenceService,
    ContactService,
    MessageRequestService,
    GroupService,
    AttachmentService,
    ProfessionalMessagingService,
    MessagingPrivacyService,
  ],
  exports: [
    MessagingService,
    PresenceService,
    MessagingGateway,
  ],
})
export class MessagingModule {}
