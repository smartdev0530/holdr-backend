import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsInt } from 'class-validator';

@InputType()
export class TradeRequestFilterInput {
  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  status?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  userId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  requestedId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  offeredId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  acceptedById?: number;
}
