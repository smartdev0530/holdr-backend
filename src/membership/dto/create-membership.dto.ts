import { IsInt, IsNumber, Max, Min } from 'class-validator';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class CreateMembershipDto {
  @Field(() => Number, { description: "The membership's price." })
  @IsNumber()
  @Min(1, { message: 'Price must be at least 1.' })
  price: number;

  @Field(() => Number, { description: "The membership's amount." })
  @IsInt()
  @Max(20, { message: "Amount can't be more than 20." })
  amount: number;
}
