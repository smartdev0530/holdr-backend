import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
import { CurrentUser, ISuccessResponse, SuccessResponseModel } from '../common';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../auth/guards';

@Resolver()
export class PaymentResolver {
  /**
   * Buy a membership from a creator
   *
   * @param id The ID of the membership.
   *
   * @param user The user data object containing the current user's ID
   */
  @Mutation(() => SuccessResponseModel, {
    description: 'Buy a membership from a creator.',
  })
  @UseGuards(AccessTokenGuard)
  async buyMemberships(
    @Args('id', {
      description: 'The ID of the membership.',
      type: () => Int,
    })
    id: number,
    @CurrentUser() user: { id: number },
  ): Promise<ISuccessResponse> {
    return {
      isSuccess: false,
      message: 'Not yet implemented',
      statusCode: HttpStatus.NOT_IMPLEMENTED,
    };
  }
}
