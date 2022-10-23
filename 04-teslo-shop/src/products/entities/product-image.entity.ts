import { Product } from './';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';


@Entity(
    // { name: 'product_images' }
    )
export class ProductImage {

    @PrimaryGeneratedColumn() //id unico: numero que se va autoincrementando
    id: number;

    @Column('text')
    url: string;

    @ManyToOne( //MUCHAS imagenes pueden tener 1 producto --> Relacion (n,1)
     //Conexion con la tabla Product
        () => Product, //regresa un Product, es decir, regresa la clase que crea la entidad
        ( product ) => product.images, //el product se relaciona con las product.images de esta tabla (estas tienen que ser del mismo tipo)
        //Eliminacion en cascada
        {  onDelete: 'CASCADE' } //cuando el producto se borre, se borrarán las imagenes en cascada
    )
    product: Product

}