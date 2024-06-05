import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from '../../user';
import { EncryptionService } from '../../encryption';
import { GraphQLException } from '@nestjs/graphql/dist/exceptions';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private encryptionService: EncryptionService,
  ) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne({ username });

    if (!user) {
      throw new GraphQLException(
        'The provided credentials are invalid. Ensure that your credentials are correct.',
        {
          extensions: {
            http: {
              status: HttpStatus.NOT_FOUND,
            },
          },
        },
      );
    }

    const isValidPassword = this.encryptionService.compareHash(
      password,
      user.digest,
    );

    if (!isValidPassword) {
      throw new GraphQLException(
        'The provided credentials are invalid. Ensure that your credentials are correct.',
        {
          extensions: {
            http: {
              status: HttpStatus.UNAUTHORIZED,
            },
          },
        },
      );
    }

    return user;
  }
}
