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
  requestMembershipId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  offerMembershipId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  acceptedById?: number;
}
