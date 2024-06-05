import { Module } from '@nestjs/common';
import { TradingService } from './trading.service';
import { TradingResolver } from './trading.resolver';
import { UserService } from '../user';

@Module({
  providers: [TradingService, UserService, TradingResolver],
})
export class TradingModule {}
