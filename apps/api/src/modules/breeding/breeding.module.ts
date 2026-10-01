import { Module } from '@nestjs/common'
import { CommercialModule } from '../commercial/commercial.module'
import { BreedingController } from './breeding.controller'
import { BreedingService } from './breeding.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule, CommercialModule],
  controllers: [BreedingController],
  providers: [BreedingService],
  exports: [BreedingService],
})
export class BreedingModule {}
