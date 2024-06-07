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
} from '../common';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards';
import { PagedTradeRequestsModel, TradeRequestModel } from './models';
import { ITradeRequest } from './types';
import { UserService } from '../user';
import { TradingService } from './trading.service';
import { GraphQLException } from '@nestjs/graphql/dist/exceptions';
import { TradeRequestFilterInput } from './dto/trade-request-filter.input';
import { SuccessTradeRequestResponseModel } from './models/success-trade-request-response.model';

@Resolver(() => TradeRequestModel)
export class TradingResolver {
  constructor(
    private userService: UserService,
    private tradingService: TradingService,
  ) {}

  /**
   * Retrieve all the trade requests.
   *
   * @param limit The maximum number of items to return
   * @param offset The index of the first item to return.
   * @param filter 'created' : tradeRequests created by user 'acceptable' : tradeRequets which is acceptable by user, 'all' : all
   * @param user The user data object containing the current user's ID
   */
  @Query(() => PagedTradeRequestsModel, {
    description: 'Retrieve all the trade requests that the user made.',
  })
  @UseGuards(AccessTokenGuard)
  async tradeRequests(
    @Args('limit', {
      description: 'The maximum number of items to return',
      type: () => Int,
      nullable: true,
    })
    limit: number,
    @Args('offset', {
      description: 'The index of the first item to return.',
      type: () => Int,
      nullable: true,
    })
    offset: number,
    @Args('filter', {
      description: 'The filter of trade requests.',
      type: () => TradeRequestFilterInput,
      nullable: true,
    })
    filter: TradeRequestFilterInput,
    @Args('onlyAcceptable', {
      description: 'return only acceptable trade requests by current user.',
      type: () => Boolean,
      nullable: true,
    })
    onlyAcceptable: boolean,
    @CurrentUser() user: { id: number },
  ): Promise<IPagedRequest<ITradeRequest, number>> {
    const currentUser = await this.userService.validateRole(user.id, [
      'general',
      'creator',
    ]);
    const onlyAcceptableFilter = {
      requested: {
        Ownership: {
          some: {
            ownerId: user.id,
            amount: {
              gt: 0,
            },
          },
        },
      },
      userId: {
        not: user.id,
      },
      acceptedAt: null,
      DeclineRequest: {
        none: {
          userId: user.id,
        },
      },
    };

    const where = onlyAcceptable
      ? { ...filter, ...onlyAcceptableFilter }
      : filter;

    if (!currentUser) {
      throw new GraphQLException(
        'You are not allowed to perform this action.',
        {
          extensions: {
            http: {
              status: HttpStatus.UNAUTHORIZED,
            },
          },
        },
      );
    }

    const [data, count] = await Promise.all([
      this.tradingService.findMany(
        where,
        { limit: limit || 20, offset: offset || 0 },
        { createdAt: 'desc' },
      ),
      this.tradingService.count(where),
    ]);

    return {
      offset: offset || 0,
      limit: limit || 20,
      count: count,
      data,
    };
  }

  /**
   * Accept the trade of owned membership with another user’s owned membership.
   *
   * @param id The ID of the trade.
   *
   * @param user The user data object containing the current user's ID
   */
  @Mutation(() => SuccessTradeRequestResponseModel, {
    description:
      'Accept the trade of owned membership with another user’s owned membership.',
  })
  @UseGuards(AccessTokenGuard)
  async acceptTrade(
    @Args('id', {
      description: 'The ID of the trade.',
      type: () => Int,
    })
    id: number,
    @CurrentUser() user: { id: number },
  ): Promise<ISuccessResponse<ITradeRequest>> {
    const currentUser = await this.userService.validateRole(user.id, [
      'general',
    ]);

    if (!currentUser) {
      throw new GraphQLException(
        'You are not allowed to perform this action.',
        {
          extensions: {
            http: {
              status: HttpStatus.UNAUTHORIZED,
            },
          },
        },
      );
    }

    try {
      const data = await this.tradingService.acceptTrade(id, user.id);

      return {
        isSuccess: true,
        message: 'The trade is accepted.',
        statusCode: HttpStatus.OK,
        data,
      };
    } catch (e) {
      console.error(`[acceptTrade mutation] ${e}`);

      return {
        isSuccess: false,
        message: `${e}`,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }

  /**
   * Decline the trade of owned membership with another user’s owned membership
   *
   * @param id The ID of the trade.
   *
   * @param user The user data object containing the current user's ID
   */
  @Mutation(() => SuccessTradeRequestResponseModel, {
    description:
      'Decline the trade of owned membership with another user’s owned membership.',
  })
  @UseGuards(AccessTokenGuard)
  async declineTrade(
    @Args('id', {
      description: 'The ID of the trade request.',
      type: () => Int,
    })
    id: number,
    @CurrentUser() user: { id: number },
  ): Promise<ISuccessResponse> {
    const currentUser = await this.userService.validateRole(user.id, [
      'general',
    ]);

    if (!currentUser) {
      throw new GraphQLException(
        'You are not allowed to perform this action.',
        {
          extensions: {
            http: {
              status: HttpStatus.UNAUTHORIZED,
            },
          },
        },
      );
    }

    try {
      const data = await this.tradingService.update(
        {
          id,
          userId: currentUser.id,
        },
        { status: 'accepted' },
      );

      return {
        isSuccess: true,
        message: 'The trade request is declined by this user.',
        statusCode: HttpStatus.OK,
        data: data,
      };
    } catch (e) {
      console.error(`[declineTrade mutation] ${e}`);

      return {
        isSuccess: false,
        message: `${e}`,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }

  /**
   * Buy a membership from a creator
   *
   * @param requestedId The ID of the membership.
   * @param offeredId The ID of the membership.
   *
   * @param user Request a trade for a membership
   */
  @Mutation(() => SuccessTradeRequestResponseModel, {
    description: 'Request a trade for a membership.',
  })
  @UseGuards(AccessTokenGuard)
  async requestTrade(
    @Args('requestedId', {
      description:
        'The ID of the membership that the user is requesting to obtain.',
      type: () => Int,
    })
    requestedId: number,
    @Args('offeredId', {
      description:
        'The ID of the membership that the user is offering to trade.',
      type: () => Int,
    })
    offeredId: number,
    @CurrentUser() user: { id: number },
  ): Promise<ISuccessResponse<ITradeRequest>> {
    const currentUser = await this.userService.validateRole(user.id, [
      'general',
    ]);

    if (!currentUser) {
      throw new GraphQLException(
        'You are not allowed to perform this action.',
        {
          extensions: {
            http: {
              status: HttpStatus.UNAUTHORIZED,
            },
          },
        },
      );
    }

    try {
      const data = await this.tradingService.create({
        requestedId,
        offeredId,
        userId: currentUser.id,
      });

      return {
        isSuccess: true,
        message: 'TradeRequest created successfully.',
        statusCode: HttpStatus.CREATED,
        data,
      };
    } catch (e) {
      console.error(`[requestTrade mutation] ${e}`);

      return {
        isSuccess: false,
        message:
          'Something weird happened. Please try again, and connect with us if it persists.',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        data: null,
      };
    }
  }

  @ResolveField()
  async requested(@Parent() tradeRequest: ITradeRequest) {
    return this.tradingService.getRequested(tradeRequest);
  }

  @ResolveField()
  async offered(@Parent() tradeRequest: ITradeRequest) {
    return this.tradingService.getOffered(tradeRequest);
  }

  @ResolveField()
  async creator(@Parent() tradeRequest: ITradeRequest) {
    return this.tradingService.getCreator(tradeRequest);
  }

  @ResolveField()
  async acceptedBy(@Parent() tradeRequest: ITradeRequest) {
    return this.tradingService.getAcceptedBy(tradeRequest);
  }

  @ResolveField()
  async declines(@Parent() tradeRequest: ITradeRequest) {
    return this.tradingService.getDeclines(tradeRequest);
  }
}
