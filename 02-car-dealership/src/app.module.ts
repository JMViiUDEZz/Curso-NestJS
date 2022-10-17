import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CarsModule } from './cars/cars.module';

@Module({
  imports: [CarsModule],
  controllers: [AppController],
  providers: [AppService], //todos los servicios son providers, pero no todos los providers son servicios
  exports: [],
})
export class AppModule {}
