import { Module } from '@nestjs/common'
import { PetsController, ProfilePetsController, PublicPetPassportController } from './pets.controller'
import { PetsService } from './pets.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [PetsController, ProfilePetsController, PublicPetPassportController],
  providers: [PetsService],
  exports: [PetsService],
})
export class PetsModule {}
