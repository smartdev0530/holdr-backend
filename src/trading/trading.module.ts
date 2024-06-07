import { Module } from '@nestjs/common';
import { TradingService } from './trading.service';
import { TradingResolver } from './trading.resolver';
import { UserService } from '../user';
import { DeclineResolver } from './decline.resolver';

@Module({
  providers: [TradingService, UserService, TradingResolver, DeclineResolver],
})
export class TradingModule {}
