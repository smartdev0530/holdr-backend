import {
  Args,
  Int,
  Mutation,
  Query,
  ResolveField,
  Resolver,
  Parent,
} from '@nestjs/graphql';
import {
  CurrentUser,
  IPagedRequest,
  ISuccessResponse,
  SuccessResponseModel,
  UserModel,
} from '../common';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards';
import { PagedTradeRequestsModel, TradeRequestModel } from './models';
import { ITradeRequest } from './types';
import { UserService } from '../user';
import { TradingService } from './trading.service';
import { GraphQLException } from '@nestjs/graphql/dist/exceptions';
import { TradeRequestFilterInput } from './dto/trade-request-filter.input';
import { DeclineRequestModel } from './models/decline-request.model';
import { IDeclineRequest } from './types/decline-request.interface';

@Resolver(() => DeclineRequestModel)
export class DeclineResolver {
  constructor(private tradingService: TradingService) {}

  @ResolveField()
  async user(@Parent() declineRequest: IDeclineRequest) {
    return this.tradingService.getDeclineUser(declineRequest);
  }

  @ResolveField()
  async tradeRequest(@Parent() declineRequest: IDeclineRequest) {
    return this.tradingService.getDeclinedTradeRequest(declineRequest);
  }
}
