import {
  Mutation,
  Resolver,
  Args,
  ResolveField,
  Parent,
  Query,
  Int,
} from '@nestjs/graphql';
import { UserService } from 'src/user';
import { MembershipService } from './membership.service';
import { MembershipModel } from './model';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards';
import { CurrentUser } from 'src/common';
import { IMembership, IMyMembership } from './types';
import { GraphQLException } from '@nestjs/graphql/dist/exceptions';
import { HttpStatus } from '@nestjs/common';
import { Role } from 'src/common';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { Membership } from '@prisma/client';
import { SuccessCreateMembershipResponseModel } from './model/success-create-membership-response.model';
import { PagedMembershipModel } from './model/paged-memberships.model';
import { IPagedRequest } from 'src/common';
import { PagedMyMembershipModel } from './model/paged-my-memberships.model';

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
  async createMembership(
    @Args() createMembershipDto: CreateMembershipDto,
    @CurrentUser() user: { id: number },
  ) {
    const currentUser = await this.userService.validateRole(user.id, [
      'creator',
    ]);
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

    const data = await this.membershipServive.createMembership(
      createMembershipDto,
      currentUser.id,
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

  @Query(() => PagedMyMembershipModel, {
    description: 'Retrieve all the memberships that the user has.',
  })
  @UseGuards(AccessTokenGuard)
  async myMemberships(
    @Args('limit', {
      description: 'The maximum number of items to return',
      type: () => Int,
      nullable: true,
    })
    limit: number,
    @Args('offset', {
      description: 'The index of the first item to return.',
      type: () => Int,
      nullable: true,
    })
    offset: number,
    @CurrentUser() user: { id: number },
  ): Promise<IPagedRequest<IMyMembership, number>> {
    const currentUser = await this.userService.validateRole(user.id, [
      'creator',
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

    return this.membershipServive.myMemberships(
      user.id,
      offset || 0,
      limit || 20,
    );
  }

  @Query(() => PagedMembershipModel, {
    description: 'Retrieve all the memberships that the user has.',
  })
  @UseGuards(AccessTokenGuard)
  async allMembership(
    @Args('limit', {
      description: 'The maximum number of items to return',
      type: () => Int,
      nullable: true,
    })
    limit: number,
    @Args('offset', {
      description: 'The index of the first item to return.',
      type: () => Int,
      nullable: true,
    })
    offset: number,
    @Args('filter', {
      description: 'filter for membership (sold/unsold/all)',
      type: () => String,
      nullable: true,
    })
    filter: 'sold' | 'unsold' | 'all',
    @CurrentUser() user: { id: number },
  ): Promise<IPagedRequest<IMembership, number>> {
    const currentUser = await this.userService.validateRole(user.id, [
      'creator',
      'general',
    ]);
    // default value for filter
    if (filter !== 'sold' && filter !== 'unsold' && filter !== 'all')
      filter = 'all';
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

    return this.membershipServive.allMemberships(
      offset || 0,
      limit || 20,
      filter,
    );
  }
}
