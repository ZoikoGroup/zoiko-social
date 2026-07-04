import { Global, Module } from '@nestjs/common'
import { RealtimeGateway } from './realtime.gateway'
import { RealtimeService } from './realtime.service'
import { AuthModule } from '../auth/auth.module'

@Global()
@Module({
  imports: [AuthModule],
  providers: [RealtimeGateway, RealtimeService],
  exports: [RealtimeService],
})
export class RealtimeModule {}
