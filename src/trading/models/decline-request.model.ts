import { Field, ObjectType, Int } from '@nestjs/graphql';
import { IUser, UserModel } from 'src/common';
import { IDeclineRequest } from '../types/decline-request.interface';
import { TradeRequestModel } from './trade-request.model';
import { ITradeRequest } from '../types';

@ObjectType({ description: '' })
export class DeclineRequestModel implements IDeclineRequest {
  @Field(() => Int)
  id: number;
  @Field(() => Date, {
    description: 'The date that the decline was made.',
  })
  createdAt: Date;

  @Field(() => Int, { description: 'The ID of declined request id.' })
  requestId: number;

  @Field(() => Int, { description: 'The ID of user who declined request.' })
  userId: number;

  @Field(() => Date, {
    description: 'The date that the trade request was updated.',
  })
  updatedAt: Date;

  @Field(() => UserModel, { description: 'The user who created this request' })
  user: IUser;

  @Field(() => TradeRequestModel, {
    description: 'The trade request which was declined',
  })
  tradeRequest: ITradeRequest;
}
