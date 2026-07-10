import { Module } from '@nestjs/common'
import { LivekitController } from './livekit.controller'
import { LivekitService } from './livekit.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [LivekitController],
  providers: [LivekitService],
  exports: [LivekitService],
})
export class LivekitModule {}
