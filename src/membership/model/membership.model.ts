import { IMembership } from '../types';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'A data model representing a membership' })
export class MembershipModel implements IMembership {
  @Field(() => Int, { description: 'The ID of the membership.' })
  id: number;
}
