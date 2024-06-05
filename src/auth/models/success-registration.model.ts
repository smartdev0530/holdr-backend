import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ISuccessResponse, IUser, UserModel } from '../../common';
import { HttpStatus } from '@nestjs/common';

@ObjectType({
  description:
    'A response model, containing the state of the response from the server.',
})
export class SuccessRegistrationResponseModel
  implements ISuccessResponse<IUser>
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
  @Field(() => UserModel, { description: 'The new user.', nullable: true })
  data: IUser;
}
