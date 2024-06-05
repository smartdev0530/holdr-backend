import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { UserModule } from './user';
import { Environment, EnvSchema } from './common';
import { AuthModule } from './auth';
import { EncryptionModule } from './encryption';
import { PaymentModule } from './payment';
import { TradingModule } from './trading/trading.module';
import { MembershipModule } from './membership/membership.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', validationSchema: EnvSchema }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        playground:
          configService.get<string>('NEST_ENVIRONMENT') ===
          Environment.Development,
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        buildSchemaOptions: { dateScalarMode: 'timestamp' },
      }),
    }),
    UserModule,
    AuthModule,
    EncryptionModule,
    PaymentModule,
    TradingModule,
    MembershipModule,
  ],
})
export class AppModule {}
