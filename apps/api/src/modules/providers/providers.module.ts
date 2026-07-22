import { Module } from '@nestjs/common'
import { ProvidersController } from './providers.controller'
import { ProvidersService } from './providers.service'
import { AuthModule } from '../auth/auth.module'
import { QueueModule } from '../queue/queue.module'

@Module({
  imports: [AuthModule, QueueModule],
  controllers: [ProvidersController],
  providers: [ProvidersService],
  exports: [ProvidersService],
})
export class ProvidersModule {}
