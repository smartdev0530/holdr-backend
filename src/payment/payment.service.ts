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
      },
    });

    if (!membership) {
      throw new NotFoundException(`No membership with ID: ${membershipId}`);
    }

    if (membership.soldAmount === membership.createdAmount) {
      throw new BadRequestException('Membership is sold out');
    }
    // update membership, and ownership of creator

    await this.prismaService.membership.update({
      where: { id: membershipId },
      data: {
        soldAmount: {
          increment: 1,
        },
      },
    });

    await this.prismaService.ownership.update({
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
    const prevOwnership = await this.prismaService.ownership.findFirst({
      where: {
        ownerId: buyerId,
        membershipId: membership.id,
      },
    });

    if (prevOwnership) {
      await this.prismaService.ownership.update({
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
      await this.prismaService.ownership.create({
        data: {
          ownerId: buyerId,
          membershipId: membershipId,
          amount: 1,
        },
      });
    }
  }
}
