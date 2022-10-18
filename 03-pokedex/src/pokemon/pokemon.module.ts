import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PokemonService } from './pokemon.service';
import { PokemonController } from './pokemon.controller';
import { Pokemon, PokemonSchema } from './entities/pokemon.entity';

@Module({
  controllers: [PokemonController],
  providers: [PokemonService],
  imports: [
    MongooseModule.forFeature([ //indicamos un Modelo
      {
        name: Pokemon.name, //este name es el que se extiende del Document en la entidad. Nombre entidad
        schema: PokemonSchema, //este schema es el que se ha exportado en la entidad
      },
    ])
  ],
  exports: [
    MongooseModule
  ]
})
export class PokemonModule {}