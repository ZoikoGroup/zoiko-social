import { Module } from '@nestjs/common'
import { ModerationController } from './moderation.controller'
import { ModerationService } from './moderation.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [ModerationController],
  providers: [ModerationService],
  exports: [ModerationService],
})
export class ModerationOpsModule {}
