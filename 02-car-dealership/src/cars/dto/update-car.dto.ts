import { IsOptional, IsString, IsUUID } from "class-validator";

export class UpdateCarDto {
    //puedo modificar algunos campos
    @IsString()
    @IsUUID()
    @IsOptional()
    readonly id?: string;

    @IsString() //validador
    @IsOptional()
    readonly brand?: string;

    @IsString()
    @IsOptional()
    readonly model?: string;
    
}