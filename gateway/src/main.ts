import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    rawBody: true,
  });

  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('4Dist API')
    .setDescription('The 4Dist API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('swagger', app, document);

  app.enableCors();
  app.set('trust proxy', true);

  await app.listen(process.env.PORT || 3000);
}
bootstrap();