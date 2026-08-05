import { Module } from '@nestjs/common'
import { NetworkController } from './network.controller'
import { NetworkService } from './network.service'
import { AuthModule } from '../auth/auth.module'
import { PersonalizationModule } from '../personalization/personalization.module'

@Module({
  imports: [AuthModule, PersonalizationModule],
  controllers: [NetworkController],
  providers: [NetworkService],
  exports: [NetworkService],
})
export class NetworkModule {}
