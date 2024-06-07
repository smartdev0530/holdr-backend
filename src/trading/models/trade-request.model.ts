import { Field, ObjectType, Int } from '@nestjs/graphql';
import { IMembership } from '../../membership/types';
import { MembershipModel } from '../../membership/model';
import { ITradeRequest } from '../types';
import { IUser, UserModel } from 'src/common';
import { DeclineRequestModel } from './decline-request.model';
import { IDeclineRequest } from '../types/decline-request.interface';

@ObjectType({ description: '' })
export class TradeRequestModel implements ITradeRequest {
  @Field(() => Int)
  id: number;
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

  @Field(() => Int, { nullable: true })
  acceptedById: number;

  @Field(() => Int)
  offeredId: number;

  @Field(() => Int)
  requestedId: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Date, {
    description: 'The date that the trade request was accepted.',
  })
  acceptedAt: Date;

  @Field(() => String, {
    description: 'Trade request status.',
  })
  status: string;

  @Field(() => Date, {
    description: 'The date that the trade request was updated.',
  })
  updatedAt: Date;

  @Field(() => UserModel, { description: 'The user who created this request' })
  creator: IUser;

  @Field(() => UserModel, {
    description: 'The user who accepted this request',
    nullable: true,
  })
  acceptedBy: IUser;

  @Field(() => [DeclineRequestModel], {
    nullable: 'itemsAndList',
    description: 'Declines of this trade request',
  })
  declines: IDeclineRequest[];
}
