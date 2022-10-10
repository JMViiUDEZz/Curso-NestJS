import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// import axios, { AxiosInstance } from 'axios';

import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

// import { async } from '@angular/core/testing';
// import { stringify } from 'querystring';

@Injectable()
export class SeedService {
  
  constructor(
    
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
    
    private readonly http: AxiosAdapter,

  ) {}

  async executeSeed() {

    await this.pokemonModel.deleteMany(); //delete * from pokemons;

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');
    
    //1ª FORMA (FACIL)
    // const insertPromisesArray = [];

    // data.results.forEach(({ name, url }) => {

    //   const segments = url.split('/');
    //   const no = +segments[ segments.length - 2 ];

    //   // const pokemon = await this.pokemonModel.create({ name, no });
    //   insertPromisesArray.push(
    //     this.pokemonModel.create({ name, no })
    //   )

    //   // console.log({ name, no })
    // });

    // await Promise.all( insertPromisesArray );

    //2ª FORMA (FACIL Y EFICIENTE)
    const pokemonToInsert: { name: string, no: number}[] = [];

    data.results.forEach(({ name, url }) => {

      const segments = url.split('/');
      const no = +segments[ segments.length - 2 ];

      // const pokemon = await this.pokemonModel.create({ name, no });
      pokemonToInsert.push({ name, no }); //[{name: bulbasaur, no: 1}]

      // console.log({ name, no })
    });

    await this.pokemonModel.insertMany( pokemonToInsert );
    
    return 'Seed Executed';
  }
}
