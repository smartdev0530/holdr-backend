import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { Membership, Prisma, User } from '@prisma/client';
import { Role } from '../common';
import { EncryptionService } from 'src/encryption';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { MembershipModel } from './model';
import { UserService } from 'src/user';

@Injectable()
export class MembershipService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly encryptionService: EncryptionService,
    private readonly userSerivce: UserService,
  ) {}

  async createMembership(payload: CreateMembershipDto, creator: User) {
    const { price, amount } = payload;
    // const tokenId = await this.encryptionService.createNewToken(
    //   creator.publicKey,
    //   amount,
    // );

    // test
    const tokenId = 10;

    const result = await this.prismaService.membership.create({
      data: {
        createdAmount: amount,
        price,
        soldAmount: 0,
        tokenId,
        creatorId: creator.id,
      },
    });

    // update ownership
    await this.prismaService.ownership.create({
      data: {
        ownerId: creator.id,
        membershipId: result.id,
        amount,
      },
    });

    return result;
  }

  async getCreator(payload: Membership) {
    return this.userSerivce.findOne({ id: payload.creatorId });
  }
}
