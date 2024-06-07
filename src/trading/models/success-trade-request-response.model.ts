import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ISuccessResponse, IUser, UserModel } from '../../common';
import { HttpStatus } from '@nestjs/common';
import { TradeRequestModel } from './trade-request.model';
import { ITradeRequest } from '../types';

@ObjectType({
  description:
    'A response model, containing the state of the response for trade request.',
})
export class SuccessTradeRequestResponseModel
  implements ISuccessResponse<ITradeRequest>
{
  @Field(() => Int, { description: 'The HTTP status of the response.' })
  statusCode?: HttpStatus;
  @Field(() => Boolean, {
    description: 'Determines whether the server action was successful.',
  })
  isSuccess: boolean;
  @Field(() => String, {
    description: 'Contextual message describing what happened.',
  })
  message: string;
  @Field(() => TradeRequestModel, {
    description: 'trade request.',
    nullable: true,
  })
  data: ITradeRequest;
}
