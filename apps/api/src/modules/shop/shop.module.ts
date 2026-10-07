import { Module } from '@nestjs/common'
import { ShopController } from './shop.controller'
import { ShopService } from './shop.service'
import { AuthModule } from '../auth/auth.module'
import { CommercialModule } from '../commercial/commercial.module'
import { MessagingModule } from '../messaging/messaging.module'

@Module({
  imports: [AuthModule, CommercialModule, MessagingModule],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
