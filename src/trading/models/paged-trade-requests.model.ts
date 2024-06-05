import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IPagedRequest } from '../../common';
import { ITradeRequest } from '../types';
import { TradeRequestModel } from './trade-request.model';

@ObjectType({ description: '' })
export class PagedTradeRequestsModel
  implements IPagedRequest<ITradeRequest, number>
{
  @Field(() => Int, { description: 'The maximum number of items to return' })
  limit: number;
  @Field(() => Int, { description: 'The index of the first item to return.' })
  offset: number;
  @Field(() => Int, { description: 'The total number of items.' })
  count: number;
  @Field(() => [TradeRequestModel], { description: 'The trade request item.' })
  data: ITradeRequest[];
}
