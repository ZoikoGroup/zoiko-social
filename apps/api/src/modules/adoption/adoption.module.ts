import { Module } from '@nestjs/common'
import { AdoptionController } from './adoption.controller'
import { AdoptionService } from './adoption.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [AdoptionController],
  providers: [AdoptionService],
  exports: [AdoptionService],
})
export class AdoptionModule {}
