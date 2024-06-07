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

  async myMemberships(userId: number, offset: number, limit: number) {
    const findPromise = this.prismaService.membership.findMany({
      where: {
        Ownership: {
          some: {
            ownerId: userId,
            amount: {
              gt: 0,
            },
          },
        },
      },
      include: {
        Ownership: {
          where: {
            ownerId: userId,
          },
          select: {
            amount: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: offset,
      take: limit,
    });
    const countPromise = this.prismaService.membership.count({
      where: {
        Ownership: {
          some: {
            ownerId: userId,
            amount: {
              gt: 0,
            },
          },
        },
      },
    });

    const [data, count] = await Promise.all([findPromise, countPromise]);
    return {
      limit,
      offset,
      count,
      data: data.map((item) => ({
        membership: item,
        membershipCount: item.Ownership[0].amount,
      })),
    };
  }

  async allMemberships(
    offset: number,
    limit: number,
    filter: 'sold' | 'unsold' | 'all',
  ) {
    let where = {};
    if (filter === 'unsold') {
      where = {
        soldAmount: {
          lt: this.prismaService.membership.fields.createdAmount,
        },
      };
    } else if (filter === 'sold') {
      where = {
        soldAmount: {
          equals: this.prismaService.membership.fields.createdAmount,
        },
      };
    }
    const findPromise = this.prismaService.membership.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });
    const countPromise = this.prismaService.membership.count({ where });

    const [data, count] = await Promise.all([findPromise, countPromise]);
    return {
      limit,
      offset,
      count,
      data: data,
    };
  }

  async createMembership(payload: CreateMembershipDto, creatorId: number) {
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
        creatorId: creatorId,
      },
    });

    // update ownership
    await this.prismaService.ownership.create({
      data: {
        ownerId: creatorId,
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
