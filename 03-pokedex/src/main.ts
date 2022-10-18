import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2'); //prefijo ruta global

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      //Transforma la informacion que viene de los Dtos:
      transform: true, 
      transformOptions: {
        enableImplicitConversion: true,
      }
    })
  );

  await app.listen(3000);
}
bootstrap();