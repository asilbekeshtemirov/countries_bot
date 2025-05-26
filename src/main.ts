import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = Number(process.env.APP_PORT) || 3000;

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  const config = new DocumentBuilder()
    .setTitle('Bot API')
    .setDescription('The Bot API')
    .setVersion('1.0')
    .addTag('Bot')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

 await app.listen(port, () => {
  console.log(`Server is running on port ${port}...`)
  
 })
}
bootstrap();
