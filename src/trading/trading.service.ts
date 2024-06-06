import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { Prisma } from '@prisma/client';

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
  constructor(private readonly prismaService: PrismaService) {}

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

    if (!requestedItem) {
      throw new BadRequestException(
        `You don't have any item with ID : ${offeredId}`,
      );
    }

    return this.prismaService.tradeRequest.create({
      data: {
        userId,
        requestMembershipId: requestedId,
        offerMembershipId: offeredId,
      },
    });
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
