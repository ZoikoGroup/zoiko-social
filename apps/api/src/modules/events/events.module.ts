import { Module } from '@nestjs/common'
import { CommercialModule } from '../commercial/commercial.module'
import { EventsController } from './events.controller'
import { EventsService } from './events.service'
import { AuthModule } from '../auth/auth.module'
import { PersonalizationModule } from '../personalization/personalization.module'

@Module({
  imports: [AuthModule, PersonalizationModule, CommercialModule],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [EventsService],
})
export class EventsModule {}
