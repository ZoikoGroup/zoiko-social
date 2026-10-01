import { Module } from '@nestjs/common'
import { ShopController } from './shop.controller'
import { ShopService } from './shop.service'
import { AuthModule } from '../auth/auth.module'
import { CommercialModule } from '../commercial/commercial.module'

@Module({
  imports: [AuthModule, CommercialModule],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
