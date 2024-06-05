import { Module } from '@nestjs/common';
import { MembershipResolver } from './membership.resolver';

@Module({
  providers: [MembershipResolver]
})
export class MembershipModule {}
