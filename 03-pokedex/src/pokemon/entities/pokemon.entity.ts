import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
// Hacemos heredar de Document para que la instancia de mi entidad se comporte como un Documento de una colección
// Decorador para indicar que es un schema de BD
@Schema()
export class Pokemon extends Document {

    // id: string // Mongo me lo da/genera

    //nombre del pokemon
    @Prop({ //reglas de negocio del campo name
        unique: true,
        index: true, // aañadimos un indice para hacer filtros, busquedas
    })
    name: string;

    //numero de pokemon
    @Prop({
        unique: true,
        index: true,
    })
    no: number;

}

//Exportamos un esquema basado en esta clase entidad y que le va a decir, al iniciar la BD, que indica a la BD todo
export const PokemonSchema = SchemaFactory.createForClass( Pokemon );