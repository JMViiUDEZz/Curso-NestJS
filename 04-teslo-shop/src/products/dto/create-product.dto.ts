import { IsArray, IsIn, IsInt, IsNumber, IsOptional, 
    IsPositive, IsString, MinLength 
} from 'class-validator';


export class CreateProductDto {

    @IsString()
    @MinLength(1)
    title: string;

    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @IsString()
    @IsOptional()
    description?: string;

    @IsString()
    @IsOptional()
    slug?: string;

    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number; 

    @IsString({ each: true }) //cada uno de los elementos tienen que ser de tipo string
    @IsArray()
    sizes: string[]

    @IsIn(['men','women','kid','unisex']) //solo permite que este dentro de esos valores
    gender: string;

    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[];

}