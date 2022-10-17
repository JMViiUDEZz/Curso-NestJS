import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

//punto de entrada de la app
async function bootstrap() {
  //crea la app de NestJS
  const app = await NestFactory.create(AppModule);

  //
  app.useGlobalPipes(
    new ValidationPipe({
      //solo deja los campos de la data
      whitelist: true, //solo deja la data que estoy esperando
      forbidNonWhitelisted: true, //no se pueden mandar propiedades que no esten en el dto
    })
  )

  //puerto utilizado
  await app.listen(3000);
}
bootstrap();
