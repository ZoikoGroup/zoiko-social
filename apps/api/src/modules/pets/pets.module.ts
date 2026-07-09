import { Module } from '@nestjs/common'
import { PetsController, ProfilePetsController } from './pets.controller'
import { PetsService } from './pets.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [PetsController, ProfilePetsController],
  providers: [PetsService],
  exports: [PetsService],
})
export class PetsModule {}
