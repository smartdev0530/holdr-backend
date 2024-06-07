import { UserModel } from 'src/common';
import { IMembership, IMyMembership } from '../types';
import { Field, Int, ObjectType } from '@nestjs/graphql';
import { MembershipModel } from './membership.model';

@ObjectType({
  description:
    'A data model representing user membership (membership and count)',
})
export class MyMembershipModel implements IMyMembership {
  @Field(() => MembershipModel, { description: 'Membership' })
  membership: IMembership;

  @Field(() => Int, { description: 'The amount of membership that user has.' })
  membershipCount: number;
}
