import { registerAs } from '@nestjs/config';

export const AuthConfig = registerAs('AuthConfig', () => ({
  JWTSecret: process.env.JWT_SECRET,
  JWTTimeToLive: process.env.JWT_TTL,
}));
