import { Module } from '@nestjs/common'
import { PaymentsController } from './payments.controller'
import { OrdersService } from './orders.service'
import { StripeService } from './stripe.service'
import { AuthModule } from '../auth/auth.module'

import { CommsModule } from '../comms/comms.module'

import { PaymentConfirmationEmailService } from './payment-confirmation-email.service'

@Module({
  imports: [AuthModule, CommsModule],
  controllers: [PaymentsController],
  providers: [OrdersService, StripeService, PaymentConfirmationEmailService],
  exports: [OrdersService, StripeService, PaymentConfirmationEmailService],
})
export class PaymentsModule {}
