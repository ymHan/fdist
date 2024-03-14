import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MemberModule } from './member/member.module';
import { RouterModule } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env.${process.env.NODE_ENV}'
    }),
    RouterModule.register([
      {
        path: 'v1',
        module: MemberModule,
      },
    ]),
  ]
})

export class AppModule {}
