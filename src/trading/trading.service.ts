import { Injectable } from '@nestjs/common';
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

    return this.prismaService.tradeRequest.create({
      data: {
        userId,
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
