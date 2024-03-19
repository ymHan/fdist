import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AccountController } from './account.controller';

import { MEMBER_PACKAGE_NAME, MEMBER_SERVICE_NAME } from '@4dist/sdk';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MEMBER_SERVICE_NAME,
        inject: [ConfigService],
        useFactory: (config: ConfigService) => ({
          transport: Transport.GRPC,
          options: {
            url: config.get('ACCOUNT_GRPC_PORT'),
            package: MEMBER_PACKAGE_NAME,
            protoPath: 'node_modules/@4dist/sdk/dist/proto/member.proto',
          },
        }),
      },
    ]),
  ],
  controllers: [AccountController],
})
export class AccountModule {}
