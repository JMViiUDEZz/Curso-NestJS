import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';

//expande todas las configuraciones que tiene CreateProductDto haciendolas opcionales en UpdateProductDto
export class UpdateProductDto extends PartialType(CreateProductDto) {}
