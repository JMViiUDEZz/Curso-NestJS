import { IsString } from "class-validator";

export class CreateCarDto {
    //todos los campos obligatorios a la hora de insertar
    @IsString() //validador
    readonly brand: string;

    @IsString()
    readonly model: string;
    
}