import { Module } from '@nestjs/common';
import { ApiController } from './api.constroller';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';
import { ChatModule } from './chat.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
      validationSchema: Joi.object({
        JWT_EXPIRATION: Joi.string().required(),
        MAIL_HOST: Joi.string().required(),
        MAIL_PORT: Joi.number().required(),
        MAIL_USER: Joi.string().required(),
        MAIL_PASSWORD: Joi.string().required(),
        MAIL_FROM: Joi.string().required(),
        VERIFY_TOKEN_TIME: Joi.string().required(),
        REDIS_USERNAME: Joi.string().required(),
        REDIS_PASSWORD: Joi.string().required(),
        REDIS_URI: Joi.string().required(),
        MONGODB_URI: Joi.string().required(),
        MONGODB_NAME: Joi.string().required(),
        MONGODB_PASSWORD: Joi.string().required(),
        FIREBASE_API_KEY: Joi.string().required(),
        FIREBASE_PROJECT_ID: Joi.string().required(),
        FIREBASE_STORAGE_BUCKET: Joi.string().required(),
      })
    }),
    ChatModule,
  ],
  controllers: [ApiController],
  providers: [],
})
export class ApiModule {}
