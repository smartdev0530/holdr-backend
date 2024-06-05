import { Module } from '@nestjs/common';
import { PaymentResolver } from './payment.resolver';

@Module({
  providers: [PaymentResolver]
})
export class PaymentModule {}
