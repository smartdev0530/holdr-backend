import { Module } from '@nestjs/common';
import { AuthResolver } from './auth.resolver';
import { UserService } from '../user';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy, LocalStrategy } from './strategies';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthConfig } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [AuthConfig] }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          issuer: 'waves.com',
          expiresIn: configService.get<number>('JWT_TTL'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthResolver, UserService, LocalStrategy, JwtStrategy],
})
export class AuthModule {}
