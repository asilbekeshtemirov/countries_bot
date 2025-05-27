import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Portni .env fayldan olish yoki default 3000
  const port = Number(process.env.APP_PORT) || 3000;

  // Global validatsiya pipe (DTOlarda ruxsat berilmagan propertylar cheklansin)
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  // Swagger API dokumentatsiyasi sozlamalari
  const config = new DocumentBuilder()
    .setTitle('Bot API')
    .setDescription('The Bot API')
    .setVersion('1.0')
    .addTag('Bot')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Serverni ishga tushirish
  await app.listen(port);
  console.log(`Server is running on port ${port}...`);
}
bootstrap();
