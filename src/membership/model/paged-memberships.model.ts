import { Field, Int, ObjectType } from '@nestjs/graphql';
import { IPagedRequest } from '../../common';
import { IMembership } from '../types';
import { MembershipModel } from './membership.model';

@ObjectType({ description: '' })
export class PagedMembershipModel
  implements IPagedRequest<IMembership, number>
{
  @Field(() => Int, { description: 'The maximum number of items to return' })
  limit: number;
  @Field(() => Int, { description: 'The index of the first item to return.' })
  offset: number;
  @Field(() => Int, { description: 'The total number of items.' })
  count: number;
  @Field(() => [MembershipModel], { description: 'The trade request item.' })
  data: IMembership[];
}
