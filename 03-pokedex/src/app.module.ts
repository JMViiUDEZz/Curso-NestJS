import { join } from 'path'; //paquete de Node
import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { PokemonModule } from './pokemon/pokemon.module';
import { MongooseModule } from '@nestjs/mongoose';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';

@Module({
  imports: [
    
    //servir contenido estatico del directorio public
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'), 
    }),

    //referencia a nuestra BBDD
    MongooseModule.forRoot('mongodb://localhost:27017/nest-pokemon'), //solo hay un forRoot en mi app

    PokemonModule,

    CommonModule,

    SeedModule,

  ],
})
export class AppModule {}
