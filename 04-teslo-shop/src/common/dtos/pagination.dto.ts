import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';


export class PaginationDto {

    @IsOptional()
    @IsPositive()
    //2ª Forma de Transformar:
    @Type( () => Number ) // enableImplicitConversions: true (1ª Forma de Transformar vista en el proyecto de pokemons --> 03-pokedex)
    limit?: number;
    
    @IsOptional()
    @Min(0)
    //2ª Forma de Transformar:
    @Type( () => Number ) // enableImplicitConversions: true (1ª Forma de Transformar vista en el proyecto de pokemons --> 03-pokedex)
    offset?: number;

}