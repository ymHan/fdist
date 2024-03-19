import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AccountModule } from './account/account.module';

import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`
    }),
    AccountModule,
    RouterModule.register([
      {
        path: 'v1',
        module: AccountModule,
      },
    ]),
  ],
})

export class AppModule {}
