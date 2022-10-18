import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PokemonService } from './pokemon.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';

import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('pokemon') //prefijo ruta controlador
export class PokemonController {
  constructor(private readonly pokemonService: PokemonService) {}

  @Post()
  // @HttpCode( HttpStatus.UNAUTHORIZED ) --> // Con este metodo puedo mandar cualquier codigo de error
  create(@Body() createPokemonDto: CreatePokemonDto) {
    return this.pokemonService.create(createPokemonDto);
  }

  @Get()
  findAll( @Query() //Con el decorador @Query() obtenemos todos los Query Parameters (Parametros de la Consulta)
  paginationDto: PaginationDto //Estos parametros (Query Parameters) seran opcionales y tendrán que estar validados --> Nos crearemos un nuevo Dto llamado PaginationDto (common\dto\pagination.dto.ts)
  ) { 
    return this.pokemonService.findAll( paginationDto );
  }

  @Get(':term')
  findOne(@Param('id') term: string) {
    return this.pokemonService.findOne( term );
  }

  @Patch(':term')
  update(@Param('term') term: string, @Body() updatePokemonDto: UpdatePokemonDto) {
    return this.pokemonService.update( term, updatePokemonDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseMongoIdPipe ) id: string) { //Creacion de ParseMongoIdPipe a nivel global (en este caso, importado desde common\pipes\parse-mongo-id.pipe.ts)
    return this.pokemonService.remove( id );
  }
}
