import { Field, InputType } from '@nestjs/graphql';
import { ICreateUser } from '../types';
import { Role, RoleScalar } from '../../common';

@InputType({ description: 'The data fields required to create a user.' })
export class CreateUserInput implements ICreateUser {
  @Field(() => String, { description: "The user's password." })
  password: string;
  @Field(() => RoleScalar, { description: "The user's role." })
  role: Role;
  @Field(() => String, { description: "The user's username." })
  username: string;
}
