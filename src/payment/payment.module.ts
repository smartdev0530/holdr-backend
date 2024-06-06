import { Module } from '@nestjs/common';
import { PaymentResolver } from './payment.resolver';
import { PrismaModule } from 'src/prisma';
import { PaymentService } from './payment.service';
import { UserModule } from 'src/user';

@Module({
  imports: [PrismaModule, UserModule],
  providers: [PaymentResolver, PaymentService],
})
export class PaymentModule {}
