import { Module } from '@nestjs/common'
import { NetworkController } from './network.controller'
import { NetworkService } from './network.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [NetworkController],
  providers: [NetworkService],
  exports: [NetworkService],
})
export class NetworkModule {}
