import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  //inyeccion de dependencias
  constructor(
    
    @InjectModel( Pokemon.name ) //asi podremos inyectar el modelo en el servicio
    private readonly pokemonModel: Model<Pokemon>, 

  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase(); //insertamos el nombre en minuscula
    //createPokemonDto ya se encuentra validado y podemos insertarlo sin problemas
    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto );
      return pokemon;
      
    } catch (error) {
      if ( error.code === 11000 ) {
        this.handleExceptions( error );
      }
      // console.log(error);
      // throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`)
    }

  }

  findAll( paginationDto: PaginationDto) {

    //Si en la consulta no viene el limit y el offset (parametros opcionales), por defecto tendrán los siguientes valores:
    const { limit = 10, offset = 0 } = paginationDto; //desestructuracion de paginationDto

    return this.pokemonModel.find()
      .limit( limit ) //va de 10 en 10 pokemons
      .skip( offset ) //se salta los primeros 0 pokemons, es decir, no se salta ningun pokemon (empieza por el primero)
      .sort({ //ordenar los pokemons alfabeticamente
        no: 1 // y de manera ascendente
      })
      .select('-__v') //si no quiero que me muestre la columna " __v", le restamos dicha columna con un guion (- que indica resta) --> '-__v'

    // return `This action returns all pokemon`;
  }

  async findOne(term: string) { //termino de busqueda (puede ser un numero,id,nombre,etc.)

    // return `This action returns a #${id} pokemon`;

    let pokemon: Pokemon; //variable pokemon = Pokemon entity
    //verificación por no 
    if ( !isNaN(+term) ) { //si es un numero (no)
      pokemon = await this.pokemonModel.findOne({ no: term });
    }

    // MongoID
    //verificación por mongoid
    if ( !pokemon && isValidObjectId( term ) ) { //si el termino es un mongoid
      pokemon = await this.pokemonModel.findById( term );
    }

    // Name
    //verificación por name
    if ( !pokemon ) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLowerCase().trim() })
    }


    if ( !pokemon ) 
      throw new NotFoundException(`Pokemon with id, name or no "${ term }" not found`); //excepcion CONTROLADA
    

    return pokemon;

  }

  async update( term: string, updatePokemonDto: UpdatePokemonDto) {

    // return `This action updates a #${term} pokemon`;

    //buscamos el pokemon por un termino
    const pokemon = await this.findOne( term );
    if ( updatePokemonDto.name )
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    
    try {
      //nos devuelve el pokemon como MODELO. Le pasamos el dto que viene por url
      await pokemon.updateOne( updatePokemonDto );
      return { ...pokemon.toJSON(), ...updatePokemonDto }; //esparcimos las propiedades de pokemon, y sobreescribimos las que tiene el updatePokemonDto
      
    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async remove( id: string) {

    // return `This action removes a #${id} pokemon`;

    // const pokemon = await this.findOne( id );
    // await pokemon.deleteOne();
    // return { id };

    //Eliminacion en 1 sola CONSULTA a la BBDD:
    //Inconveniente: Si el id no se encuenta en la BBDD, sale un status 200 y no deberia de ser asi
    // const result = await this.pokemonModel.findByIdAndDelete( id );

    //Solucion:
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if ( deletedCount === 0 ) //si no se ha borrado ningun pokemon 
      throw new BadRequestException(`Pokemon with id "${ id }" not found`);

    return;
  }


private handleExceptions( error: any ) {
  //manejamos excepciones NO CONTROLADAS
  if ( error.code === 11000 ) {
    throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify( error.keyValue ) }`);
  }
  console.log(error); //lanzamos la excepción si es otro error <> 11000
  throw new InternalServerErrorException(`Can't create Pokemon - Check server logs`);
}

}
