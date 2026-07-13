import { Module } from '@nestjs/common'
import { PaymentsController } from './payments.controller'
import { OrdersService } from './orders.service'
import { StripeService } from './stripe.service'
import { AuthModule } from '../auth/auth.module'

@Module({
  imports: [AuthModule],
  controllers: [PaymentsController],
  providers: [OrdersService, StripeService],
  exports: [OrdersService, StripeService],
})
export class PaymentsModule {}
