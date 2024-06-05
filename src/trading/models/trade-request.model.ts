import { Field, ObjectType } from '@nestjs/graphql';
import { IMembership } from '../../membership/types';
import { MembershipModel } from '../../membership/model';
import { ITradeRequest } from '../types';

@ObjectType({ description: '' })
export class TradeRequestModel implements ITradeRequest {
  @Field(() => Date, {
    description: 'The date that the trade request was made.',
  })
  createdAt: Date;
  @Field(() => MembershipModel, {
    description: 'Data about the offered membership.',
  })
  offered: IMembership;
  @Field(() => MembershipModel, {
    description: 'Data about the requested membership.',
  })
  requested: IMembership;
}
