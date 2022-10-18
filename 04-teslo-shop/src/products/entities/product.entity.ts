import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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