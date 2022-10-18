import { PartialType } from '@nestjs/mapped-types';
import { CreatePokemonDto } from './create-pokemon.dto';

//la clase UpdatePokemonDto va a tener todas la propiedades con las mismas condiciones
//que la de CreatePokemonDto, excepto que todas van a ser opcionales
export class UpdatePokemonDto extends PartialType(CreatePokemonDto) {}
