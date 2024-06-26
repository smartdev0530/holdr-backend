import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { Prisma, PrismaClient } from '@prisma/client';
import { ITradeRequest } from './types';
import { IDeclineRequest } from './types/decline-request.interface';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { EncryptionService } from 'src/encryption';

interface ICreateTradeRequest {
  requestedId: number;
  offeredId: number;
  userId: number;
}

interface IPaginationOptions {
  limit: number;
  offset: number;
}

@Injectable()
export class TradingService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly encryptionService: EncryptionService,
  ) {}

  /**
   * Create a new trade request record.
   *
   * @param requestedId the ID of the membership being requested
   * @param offeredId the ID of the membership being offered
   * @param userId the ID of the user
   */
  async create({ requestedId, offeredId, userId }: ICreateTradeRequest) {
    console.log(requestedId, offeredId);

    if (requestedId === offeredId) {
      throw new BadRequestException(
        'Request and offer should be different items!',
      );
    }

    const requestedItem = await this.prismaService.membership.findFirst({
      where: {
        id: requestedId,
      },
      select: {
        id: true,
      },
    });

    if (!requestedItem) {
      throw new BadRequestException(
        `Can not find requested item with ID : ${requestedId}`,
      );
    }

    const offerItemOwnership = await this.prismaService.ownership.findFirst({
      where: {
        ownerId: userId,
        membershipId: offeredId,
        amount: {
          gt: 0,
        },
      },
    });

    if (!offerItemOwnership) {
      throw new BadRequestException(
        `You don't have any item with ID : ${offeredId}`,
      );
    }

    return this.prismaService.tradeRequest.create({
      data: {
        userId,
        requestedId,
        offeredId,
      },
    });
  }

  async getRequested(tradeRequest: ITradeRequest) {
    return this.prismaService.membership.findFirst({
      where: {
        id: tradeRequest.requestedId,
      },
    });
  }

  async getOffered(tradeRequest: ITradeRequest) {
    return this.prismaService.membership.findFirst({
      where: {
        id: tradeRequest.offeredId,
      },
    });
  }

  async getCreator(tradeRequest: ITradeRequest) {
    return this.prismaService.user.findFirst({
      where: {
        id: tradeRequest.userId,
      },
    });
  }

  async getAcceptedBy(tradeRequest: ITradeRequest) {
    if (tradeRequest.acceptedById)
      return this.prismaService.user.findFirst({
        where: {
          id: tradeRequest.acceptedById,
        },
      });
    return null;
  }

  async getDeclines(tradeRequest: ITradeRequest) {
    return this.prismaService.declineRequest.findMany({
      where: {
        requestId: tradeRequest.id,
      },
    });
  }

  async getDeclineUser(declineRequest: IDeclineRequest) {
    return this.prismaService.user.findFirst({
      where: {
        id: declineRequest.userId,
      },
    });
  }

  async getDeclinedTradeRequest(declineRequest: IDeclineRequest) {
    return this.prismaService.tradeRequest.findFirst({
      where: {
        id: declineRequest.requestId,
      },
    });
  }

  async acceptTrade(tradeId: number, acceptorId: number) {
    const currentTrade = await this.prismaService.tradeRequest.findFirst({
      where: { id: tradeId },
      include: {
        requested: {
          select: {
            tokenId: true,
          },
        },
        offered: {
          select: {
            tokenId: true,
          },
        },
      },
    });

    if (!currentTrade || currentTrade.acceptedAt) {
      throw new BadRequestException(
        `There's not active trade with ID : ${tradeId}. It might be accepted or declined.`,
      );
    }

    if (acceptorId === currentTrade.userId) {
      throw new BadRequestException(
        `You are creator of this trade. Can't accept it.`,
      );
    }
    const declinedTrade = await this.prismaService.declineRequest.findFirst({
      where: {
        requestId: tradeId,
        userId: acceptorId,
      },
      select: {
        id: true,
      },
    });

    if (declinedTrade) {
      throw new BadRequestException(
        "You've already declined this trade before.",
      );
    }

    // check if accepter has item
    const acceptOwnership = await this.prismaService.ownership.findFirst({
      where: {
        membershipId: currentTrade.requestedId,
        ownerId: acceptorId,
        amount: {
          gt: 0,
        },
      },
      select: {
        id: true,
      },
    });

    if (!acceptOwnership) {
      throw new BadRequestException(
        'Can not accept because you do not have requested item!',
      );
    }

    // check if offerer still has item
    const offerOwnership = await this.prismaService.ownership.findFirst({
      where: {
        membershipId: currentTrade.offeredId,
        ownerId: currentTrade.userId,
        amount: {
          gt: 0,
        },
      },
      select: {
        id: true,
      },
    });

    if (!offerOwnership) {
      throw new BadRequestException(
        'Can not accept because offerer no longger has offered item!',
      );
    }

    // on-chain to accept transaction
    const acceptor = await this.prismaService.user.findFirst({
      where: {
        id: acceptorId,
      },
    });

    const requester = await this.prismaService.user.findFirst({
      where: {
        id: currentTrade.userId,
      },
    });

    const sendToAcceptorPromise = this.encryptionService.sendToken(
      currentTrade.offered.tokenId,
      acceptor.publicKey,
      requester.publicKey,
      requester.privateKey,
    );

    const sendToRequesterPromise = this.encryptionService.sendToken(
      currentTrade.requested.tokenId,
      requester.publicKey,
      acceptor.publicKey,
      acceptor.privateKey,
    );

    await Promise.all([sendToAcceptorPromise, sendToRequesterPromise]);

    // accept and update ownership
    // rollback when any one of tx is not done
    return await this.prismaService.$transaction(async (tx) => {
      // decrement on sending item
      await tx.ownership.update({
        where: {
          ownerId_membershipId: {
            ownerId: currentTrade.userId,
            membershipId: currentTrade.offeredId,
          },
        },
        data: {
          amount: {
            decrement: 1,
          },
        },
      });
      await tx.ownership.update({
        where: {
          ownerId_membershipId: {
            ownerId: acceptorId,
            membershipId: currentTrade.requestedId,
          },
        },
        data: {
          amount: {
            decrement: 1,
          },
        },
      });

      //incremement on sending item
      await this.addOrIncrementOwnership(
        tx,
        acceptorId,
        currentTrade.offeredId,
      );

      await this.addOrIncrementOwnership(
        tx,
        currentTrade.userId,
        currentTrade.requestedId,
      );

      // accept TradeRequest
      return await tx.tradeRequest.update({
        where: { id: currentTrade.id },
        data: {
          acceptedAt: new Date(),
          acceptedById: acceptorId,
          status: 'accepted',
        },
      });
    });
  }

  async declineTradeRequest(tradeId: number, userId: number) {
    const prevDecline = await this.prismaService.declineRequest.findFirst({
      where: {
        userId,
        requestId: tradeId,
      },
      select: {
        id: true,
      },
    });

    if (prevDecline) {
      throw new BadRequestException(
        'This trade has been declined by you already!',
      );
    }

    const currentTrade = await this.prismaService.tradeRequest.findFirst({
      where: {
        id: tradeId,
        acceptedAt: null,
      },
      select: {
        id: true,
      },
    });

    if (!currentTrade) {
      throw new BadRequestException(
        `There's no unaccepted trade with ID : ${tradeId}`,
      );
    }

    await this.prismaService.declineRequest.create({
      data: {
        userId,
        requestId: tradeId,
      },
    });

    return currentTrade;
  }

  async addOrIncrementOwnership(
    tx: Omit<
      PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
      '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
    >,
    ownerId: number,
    membershipId: number,
  ) {
    const prevOwnership = await tx.ownership.findFirst({
      where: {
        ownerId,
        membershipId,
      },
    });

    if (prevOwnership) {
      await tx.ownership.update({
        where: {
          ownerId_membershipId: {
            ownerId,
            membershipId,
          },
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
          ownerId,
          membershipId,
          amount: 1,
        },
      });
    }
  }

  /**
   * Update the trade request record.
   *
   * @param where the where clause options
   * @param data the data to update
   */
  async update(
    where: Prisma.TradeRequestWhereUniqueInput,
    data: { status: string },
  ) {
    return this.prismaService.tradeRequest.update({
      where,
      data,
    });
  }

  /**
   * Get all the trade request records.
   *
   * @param where the where clause options
   * @param orderBy the options used to order the data
   * @param data the data to update
   */
  async findMany(
    where: Prisma.TradeRequestWhereInput,
    { limit, offset }: IPaginationOptions,
    orderBy?: Prisma.TradeRequestOrderByWithRelationInput,
  ) {
    return this.prismaService.tradeRequest.findMany({
      skip: offset,
      take: limit,
      where,
      orderBy,
    });
  }

  /**
   * Get a count of trade request records.
   *
   * @param where the where clause options
   */
  async count(where: Prisma.TradeRequestWhereInput) {
    return this.prismaService.tradeRequest.count({
      where,
    });
  }
}
