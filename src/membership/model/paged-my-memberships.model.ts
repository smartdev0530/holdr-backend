import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IPagedRequest } from '../../common';
import { IMyMembership } from '../types';
import { MyMembershipModel } from './my-membership.model';

@ObjectType({ description: '' })
export class PagedMyMembershipModel
  implements IPagedRequest<IMyMembership, number>
{
  @Field(() => Int, { description: 'The maximum number of items to return' })
  limit: number;
  @Field(() => Int, { description: 'The index of the first item to return.' })
  offset: number;
  @Field(() => Int, { description: 'The total number of items.' })
  count: number;
  @Field(() => [MyMembershipModel], { description: 'The trade request item.' })
  data: IMyMembership[];
}
