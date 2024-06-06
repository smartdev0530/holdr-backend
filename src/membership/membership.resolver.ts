import {
  Mutation,
  Resolver,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UserService } from 'src/user';
import { MembershipService } from './membership.service';
import { MembershipModel } from './model';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/common';
import { IMembership } from './types';
import { GraphQLException } from '@nestjs/graphql/dist/exceptions';
import { HttpStatus } from '@nestjs/common';
import { Role } from 'src/common';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { Membership } from '@prisma/client';
import { SuccessCreateMembershipResponseModel } from './model/success-create-membership-response.model';

@Resolver(() => MembershipModel)
export class MembershipResolver {
  constructor(
    private readonly userService: UserService,
    private readonly membershipServive: MembershipService,
  ) {}

  @Mutation(() => SuccessCreateMembershipResponseModel, {
    description: 'Create a new membership',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(AccessTokenGuard)
  async createNewMembership(
    @Args() createMembershipDto: CreateMembershipDto,
    @CurrentUser() user: { id: number },
  ) {
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

    if ((currentUser.role as Role) !== 'creator') {
      throw new GraphQLException(
        'This user is not creator. Only creator can create membership!',
        {
          extensions: {
            http: {
              status: HttpStatus.UNAUTHORIZED,
            },
          },
        },
      );
    }

    const data = await this.membershipServive.createMembership(
      createMembershipDto,
      currentUser,
    );

    return {
      isSuccess: true,
      message: 'Successfully created membership.',
      statusCode: HttpStatus.CREATED,
      data,
    };
  }

  @ResolveField()
  async creator(@Parent() membership: Membership) {
    return this.membershipServive.getCreator(membership);
  }
}
