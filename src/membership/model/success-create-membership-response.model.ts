import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ISuccessResponse, IUser, UserModel } from '../../common';
import { HttpStatus } from '@nestjs/common';
import { MembershipModel } from './membership.model';

@ObjectType({
  description:
    'A response model, containing the state of the response from the server.',
})
export class SuccessCreateMembershipResponseModel
  implements ISuccessResponse<MembershipModel>
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
  @Field(() => MembershipModel, {
    description: 'The created membership.',
    nullable: true,
  })
  data: MembershipModel;
}
