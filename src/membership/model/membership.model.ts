import { UserModel } from 'src/common';
import { IMembership } from '../types';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'A data model representing a membership' })
export class MembershipModel implements IMembership {
  @Field(() => Int, { description: 'The ID of the membership.' })
  id: number;
  @Field(() => Date, { description: 'The date the membership was created.' })
  createdAt: Date;
  @Field(() => Date, { description: 'The date the membership was created.' })
  updatedAt: Date;
  @Field(() => UserModel, { description: 'The creator of the membership.' })
  creator: UserModel;
  @Field(() => Int, { description: 'The price the membership .' })
  price: number;
  @Field(() => Int, {
    description: 'The tokenId the membership in smart contract.',
  })
  tokenId: number;
  @Field(() => Int, { description: 'The created amount of the membership.' })
  createdAmount: number;
  @Field(() => Int, { description: 'The sold amount of the membership.' })
  soldAmount: number;
}
