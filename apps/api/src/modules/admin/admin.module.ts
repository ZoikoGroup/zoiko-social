import { Module } from '@nestjs/common'
import { AdminController } from './admin.controller'
import { AdminService } from './admin.service'
import { AuthModule } from '../auth/auth.module'
import { CommsModule } from '../comms/comms.module'
import { ConfigModule } from '../config/config.module'

@Module({
  imports: [AuthModule, CommsModule, ConfigModule],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
