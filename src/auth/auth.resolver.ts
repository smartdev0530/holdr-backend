import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from '../user';
import { ISuccessResponse, IUser, JoiValidationPipe, Role } from '../common';
import { HttpStatus, UseGuards } from '@nestjs/common';
import { CreateUserInput } from './inputs';
import { CreateUserSchema } from './schema';
import { EncryptionService } from '../encryption';
import { SuccessRegistrationResponseModel } from './models';
import { LocalAuthGuard } from './guards';
import { JwtService } from '@nestjs/jwt';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly userService: UserService,
    private readonly encryptionService: EncryptionService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Create an account for a user.
   *
   * @param payload the data required to register for a new user account
   */
  @Mutation(() => SuccessRegistrationResponseModel, {
    description: 'Create an account for a user.',
  })
  async register(
    @Args('payload', new JoiValidationPipe(CreateUserSchema))
    payload: CreateUserInput,
  ): Promise<ISuccessResponse<IUser>> {
    try {
      const user = await this.userService.findOne({
        username: payload.username,
      });

      if (user) {
        return {
          isSuccess: false,
          message: 'The username is already taken.',
          statusCode: HttpStatus.CONFLICT,
          data: null,
        };
      }

      const { digest, ...data } = await this.userService.createUser({
        digest: this.encryptionService.generateHash(payload.password),
        username: payload.username,
        role: payload.role,
      });

      return {
        isSuccess: true,
        message: 'Successfully created your account.',
        statusCode: HttpStatus.CREATED,
        data: { ...data, role: data.role as Role },
      };
    } catch (e) {
      console.error(e);

      return {
        isSuccess: false,
        message: 'Something awful happened. Please try again later.',
        statusCode: HttpStatus.OK,
        data: null,
      };
    }
  }

  /**
   * Verify the user credentials and receive an access token.
   *
   * @param username The user's username.
   * @param password The user's password.
   *
   * @param user The user data object containing the current user's ID
   */
  @Mutation(() => String, {
    description: 'Verify the user credentials and receive an access token.',
  })
  @UseGuards(LocalAuthGuard)
  async login(
    @Args('username', { description: "The user's username." }) username: string,
    @Args('password', { description: "The user's password." }) password: string,
    @Context('user') user: IUser,
  ) {
    return this.jwtService.signAsync({ sub: user.id });
  }
}
