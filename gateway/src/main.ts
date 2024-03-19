import { INestApplication, Logger, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Version } from './common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
    cors: true,
  });
  const config: ConfigService = app.get(ConfigService);
  const logger: Logger = new Logger();
  const port: number = config.get('PORT');

  configure(app);

  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('4Dist API')
    .setDescription('The 4Dist API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, document);

  app.set('trust proxy', 1);

  await app.listen(port || 3000, () => {
    logger.log(`[NOD] ${process.version}`);
    logger.log(`[ENV] ${process.env.NODE_ENV}`);
    logger.log(`[DKR] ${(!!process.env.IS_DOCKER)}`);
    logger.log(`[URL] http://localhost:${port}`);
  });
}

const configure = (app: INestApplication) => {
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: Version.One,
  })
}

bootstrap().then(() => {
  console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
