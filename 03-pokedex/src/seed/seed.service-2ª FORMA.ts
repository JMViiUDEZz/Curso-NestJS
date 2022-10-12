import { PokeResponse } from './interfaces/poke-response.interface';
import { Injectable } from '@nestjs/common';
// import axios, { AxiosInstance } from 'axios';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  //creamos una dependencia de axios en mo proyecto
  // private readonly axios: AxiosInstance = axios;
  
  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
    ) {
  }
  async executeSeed(){
    //borra todos los datos
    await this.pokemonModel.deleteMany({});
    // const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=50');
    const  data  = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=50');
    const pokemonArray: { name: string, no: number }[] = [];
    data.results.forEach( async ({name, url}) => {
      // console.log(name, url);
      const segmentos = url.split('/');
      const no: number = +segmentos[segmentos.length - 2];
      //contiene los pokemons a insertar
      pokemonArray.push({ name, no });
      return  'Seed execute';
    });
    //en una sola petición a la BD lanzamos 100 inserciones
    await this.pokemonModel.insertMany(pokemonArray);
  }
}