import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProductImage } from './';

@Entity() //Entity: Representacion de este objeto en la BBDD
export class Product { //Product: Tabla

    @PrimaryGeneratedColumn('uuid') //id: Columna
    id: string;

    @Column('text', {
        unique: true, //no pueden haber 2 productos con el mismo nombre
    })
    title: string;

    @Column('float',{
        default: 0 //si creo un nuevo producto y no especifico el precio, este por defecto sera 0
    })
    price: number;

    @Column({
        type: 'text',
        nullable: true //acepta nulos
    })
    description: string;

    @Column('text', {
        unique: true //no pueden haber 2 productos con el mismo slug
    })
    slug: string;

    @Column('int', {
        default: 0 //si creo un nuevo producto y no especifico el stock, este por defecto sera 0
    })
    stock: number;

    @Column('text',{
        array: true
    })
    sizes: string[];

    @Column('text')
    gender: string;

    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    // images
    @OneToMany( //1 producto puede tener MUCHAS imagenes --> Relacion (1,n)
    //Conexion con la tabla ProductImage
        () => ProductImage, //regresa un ProductImage, es decir, regresa la clase que crea la entidad
        (productImage) => productImage.product, //la productImage se relaciona con la productImage.product de esta tabla (estas tienen que ser del mismo tipo)
        { 
            cascade: true, //cascade: true --> si elimino un producto, eliminara las imagenes asociadas a este
            // eager: true 
        } 
    )
    images?: ProductImage[];

    //Antes de insertar ejecutamos el método checkSlugInsert()
    @BeforeInsert()
    checkSlugInsert() {

        if ( !this.slug ) { //si slug no existe
            this.slug = this.title; //slug sera igual al title, ya que title es obligatorio pero ademas:
        }

        this.slug = this.slug
            .toLowerCase() //lo paso a minuscula
            .replaceAll(' ','_') //lo remplazo
            .replaceAll("'",'') //lo inserto

    }

    //Antes de actualizar ejecutamos el método checkSlugUpdate()
    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ','_')
            .replaceAll("'",'')
    }


}