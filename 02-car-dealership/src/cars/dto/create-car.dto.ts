import { IsString } from "class-validator";

export class CreateCarDto {
    //todos los campos obligatorios a la hora de insertar
    @IsString() //validador
    readonly brand: string; //todos suelen ser readonly, para que salga un error si accidentalmente hacemos alguna modificacion

    @IsString()
    readonly model: string;
    
}