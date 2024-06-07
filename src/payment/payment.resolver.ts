import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser, ISuccessResponse, SuccessResponseModel } from '../common';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards';
import { PaymentService } from './payment.service';
import { UserService } from 'src/user';
import { GraphQLException } from '@nestjs/graphql/dist/exceptions';
import { SuccessCreateMembershipResponseModel } from 'src/membership/model/success-create-membership-response.model';
import { IMembership } from 'src/membership/types';

@Resolver()
export class PaymentResolver {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly userService: UserService,
  ) {}
  /**
   * Buy a membership from a creator
   *
   * @param id The ID of the membership.
   *
   * @param user The user data object containing the current user's ID
   */
  @Mutation(() => SuccessCreateMembershipResponseModel, {
    description: 'Buy a membership from a creator.',
  })
  @UseGuards(AccessTokenGuard)
  async buyMembership(
    @Args('id', {
      description: 'The ID of the membership.',
      type: () => Int,
    })
    id: number,
    @CurrentUser() user: { id: number },
  ): Promise<ISuccessResponse<IMembership>> {
    const currentUser = await this.userService.validateRole(user.id, [
      'general',
    ]);

    if (!currentUser) {
      throw new GraphQLException(
        'You are not allowed to perform this action.',
        {
          extensions: {
            http: {
              status: HttpStatus.UNAUTHORIZED,
            },
          },
        },
      );
    }

    try {
      const data = await this.paymentService.buyMembership(id, user.id);
      return {
        isSuccess: true,
        message: 'User bought membership!',
        statusCode: HttpStatus.OK,
        data: data,
      };
    } catch (error) {
      return {
        isSuccess: false,
        message: `${error}`,
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  }
}
