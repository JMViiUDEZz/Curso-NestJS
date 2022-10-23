import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot(), //configuracion para establecer las variables de entorno

    TypeOrmModule.forRoot({ //solo va a haber un forRoot, si queremos expandir mas funcionalidades utilizaremos forFeature()
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,      
      //utilizaremos 2 propiedades:
      autoLoadEntities: true, //carga automaticamente nuestras entidades
      synchronize: true, //en produccion lo deberiamos desactivar (synchronize: false), ya que al cambiar algo en nuestras entidades las sincroniza automaticamente
    }),

    ProductsModule,

    CommonModule,

    SeedModule,
  ],
})
export class AppModule {}