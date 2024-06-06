import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { EncryptionModule } from 'src/encryption';
import { PrismaModule } from 'src/prisma';

@Module({
  imports: [EncryptionModule, PrismaModule],
  providers: [UserResolver, UserService],
  exports: [UserService],
})
export class UserModule {}
