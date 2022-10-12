import { InjectModel } from '@nestjs/mongoose';
import { Injectable, BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class PokemonService {

  constructor(
    
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,

  ) {}

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
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

    const { limit = 10, offset = 0 } = paginationDto;

    return this.pokemonModel.find()
      .limit( limit )
      .skip( offset )
      .sort({
        no: 1
      })
      .select('-__v')
    // return `This action returns all pokemon`;
  }

  async findOne(term: string) { //termino de busqueda
    // return `This action returns a #${id} pokemon`;

    let pokemon: Pokemon;
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
      throw new NotFoundException(`Pokemon with id, name or no "${ term }" not found`);
    

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
      return { ...pokemon.toJSON(), ...updatePokemonDto };
      
    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async remove( id: string) {
    // return `This action removes a #${id} pokemon`;
    // const pokemon = await this.findOne( id );
    // await pokemon.deleteOne();
    // return { id };
    // const result = await this.pokemonModel.findByIdAndDelete( id );
    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });
    if ( deletedCount === 0 )
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
