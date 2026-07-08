import { Module } from '@nestjs/common'
import { LostFoundController } from './lost-found.controller'
import { LostFoundService } from './lost-found.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [LostFoundController],
  providers: [LostFoundService],
  exports: [LostFoundService],
})
export class LostFoundModule {}
