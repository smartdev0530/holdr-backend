import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ISuccessResponse } from '../types';
import { HttpStatus } from '@nestjs/common';

@ObjectType({
  description:
    'A response model, containing the state of the response from the server.',
})
export class SuccessResponseModel implements ISuccessResponse {
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
}
