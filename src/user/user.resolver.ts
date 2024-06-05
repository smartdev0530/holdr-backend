import { Resolver, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards';
import { IUser, Role, UserModel, CurrentUser } from '../common';
import { GraphQLException } from '@nestjs/graphql/dist/exceptions';

@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  /**
   * Get the current user's profile.
   *
   * @param user The user data object containing the current user's ID
   */
  @Query(() => UserModel, { description: "Get the current user's profile." })
  @UseGuards(AccessTokenGuard)
  async profile(@CurrentUser() user: { id: number }): Promise<IUser> {
    const currentUser = await this.userService.findOne({ id: user.id });
    // .then((data) => this.userService.omitDigest(data));

    if (!currentUser) {
      throw new GraphQLException(
        'Something weird happened. Please try again, and connect with us if it persists.',
        {
          extensions: {
            http: {
              status: HttpStatus.INTERNAL_SERVER_ERROR,
            },
          },
        },
      );
    }

    return { ...currentUser, role: currentUser.role as Role };
  }
}
