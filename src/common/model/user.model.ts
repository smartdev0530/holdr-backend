import { Field, ObjectType } from '@nestjs/graphql';
import { IUser, Role } from '../types';

@ObjectType({ description: 'The model describing the user.' })
export class UserModel implements IUser {
  @Field(() => Date, { description: 'The date the user was created.' })
  createdAt: Date;
  @Field(() => String, { description: "The user's ID." })
  id: number;
  @Field(() => String, { description: "The user's role." })
  role: Role;
  @Field(() => Date, { description: 'The date the user was created.' })
  updatedAt: Date;
  @Field(() => String, { description: "The user's username." })
  username: string;
}
