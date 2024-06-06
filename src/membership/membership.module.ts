import { Module } from '@nestjs/common';
import { MembershipResolver } from './membership.resolver';
import { PrismaModule } from 'src/prisma';
import { UserModule } from 'src/user';
import { MembershipService } from './membership.service';

@Module({
  imports: [PrismaModule, UserModule],
  providers: [MembershipResolver, MembershipService],
})
export class MembershipModule {}
