import { Module } from '@nestjs/common'
import { CommercialModule } from '../commercial/commercial.module'
import { ProvidersController } from './providers.controller'
import { ProvidersService } from './providers.service'
import { AuthModule } from '../auth/auth.module'
import { QueueModule } from '../queue/queue.module'

@Module({
  imports: [AuthModule, QueueModule, CommercialModule],
  controllers: [ProvidersController],
  providers: [ProvidersService],
  exports: [ProvidersService],
})
export class ProvidersModule {}
