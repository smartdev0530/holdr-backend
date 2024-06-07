import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma';
import { Membership, Prisma, User } from '@prisma/client';
import { Role } from '../common';
import { EncryptionService } from 'src/encryption';
import { UserService } from 'src/user';

@Injectable()
export class PaymentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly encryptionService: EncryptionService,
  ) {}

  async buyMembership(membershipId: number, buyerId: number) {
    const membership = await this.prismaService.membership.findFirst({
      where: { id: membershipId },
      select: {
        id: true,
        creatorId: true,
        soldAmount: true,
        createdAmount: true,
        tokenId: true,
      },
    });

    const buyer = await this.prismaService.user.findFirst({
      where: {
        id: buyerId,
      },
    });

    const creator = await this.prismaService.user.findFirst({
      where: {
        id: membership.creatorId,
      },
    });

    if (!membership) {
      throw new NotFoundException(`No membership with ID: ${membershipId}`);
    }

    if (membership.soldAmount === membership.createdAmount) {
      throw new BadRequestException('Membership is sold out');
    }

    // update membership, and ownership of creator, if failed we need to rollback

    // send token on-chain
    await this.encryptionService.sendToken(
      membership.tokenId,
      buyer.publicKey,
      creator.publicKey,
      creator.privateKey,
    );

    return await this.prismaService.$transaction(async (tx) => {
      await tx.ownership.update({
        where: {
          ownerId_membershipId: {
            ownerId: membership.creatorId,
            membershipId,
          },
        },
        data: {
          amount: {
            decrement: 1,
          },
        },
      });

      // update ownership of buyer
      const prevOwnership = await tx.ownership.findFirst({
        where: {
          ownerId: buyerId,
          membershipId: membership.id,
        },
      });

      if (prevOwnership) {
        await tx.ownership.update({
          where: {
            id: prevOwnership.id,
          },
          data: {
            amount: {
              increment: 1,
            },
          },
        });
      } else {
        await tx.ownership.create({
          data: {
            ownerId: buyerId,
            membershipId: membershipId,
            amount: 1,
          },
        });
      }

      //return updated membership
      return await tx.membership.update({
        where: { id: membershipId },
        data: {
          soldAmount: {
            increment: 1,
          },
        },
      });
    });
  }
}
