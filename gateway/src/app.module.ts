import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.${process.env.NODE_ENV}'
    }),
    RouterModule.register([
    ]),
  ]
})

export class AppModule {}