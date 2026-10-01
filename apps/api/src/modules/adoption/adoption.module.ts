import { Module } from '@nestjs/common'
import { CommercialModule } from '../commercial/commercial.module'
import { AdoptionController } from './adoption.controller'
import { AdoptionService } from './adoption.service'
import { AuthModule } from '../auth/auth.module'
import { PersonalizationModule } from '../personalization/personalization.module'

@Module({
  imports: [AuthModule, PersonalizationModule, CommercialModule],
  controllers: [AdoptionController],
  providers: [AdoptionService],
  exports: [AdoptionService],
})
export class AdoptionModule {}
