import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma';
import { Prisma, User } from '@prisma/client';
import { Role } from '../common';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  /**
   * Create a new user.
   *
   * @param data required to create a new user:
   * - `username`: the user's username
   * - `digest`: a digest of the user's password (hashed)
   * - `role`: the role of the user - "creator" or "general
   */
  async createUser(data: Prisma.UserCreateInput): Promise<User> {
    return this.prismaService.user.create({ data });
  }

  /**
   * Find one user.
   *
   * @param where the options to use to filter the search:
   */
  async findOne(where?: Prisma.UserWhereInput): Promise<User> {
    return this.prismaService.user.findFirst({ where });
  }

  /**
   * Validate whether a user account with the given role exists
   *
   * @param id the user account ID
   * @param roles the role to check against
   */
  async validateRole(id: number, roles: Role[]) {
    const currentUser = await this.findOne({ id }).then((data) =>
      this.omitDigest(data),
    );

    if (
      !currentUser ||
      (currentUser && !roles.includes(currentUser.role as Role))
    ) {
      return null;
    }

    return currentUser;
  }

  /**
   * Remove the digest from the user.
   * @param user
   */
  omitDigest(user: User) {
    if (!user) {
      return null;
    }

    const { digest, ...userWithoutDigest } = user;

    return userWithoutDigest;
  }
}
