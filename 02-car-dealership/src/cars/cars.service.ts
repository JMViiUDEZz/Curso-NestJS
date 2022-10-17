import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { CreateCarDto, UpdateCarDto } from './dto';
import { Car } from './interfaces/car.interface';

@Injectable() //se puede inyectar
export class CarsService {

    private cars: Car[] = [ //private: la variable solo se puede utilizar en el servicio
        {
            id: uuid(), //cada vez que se lance la app, dicha funcion generara un nuevo uuid
            //en este caso, lo modificamos en la app, pero realmente los datos de la base de datos no cambiarán su id,
            brand: 'Toyota',
            model: 'Corolla' 
        },
        {
            id: uuid(),
            brand: 'Honda',
            model: 'Civic' 
        },
        {
            id: uuid(),
            brand: 'Jeep',
            model: 'Cherokee' 
        },
    ];


    findAll() {
        // console.log(this.cars);
        //llamada asincrona a la BD 
        //select * from cars
        return this.cars;
    }

    findOneById( id: string ) {
        //select car.* from cars where car.id = ${id}
        // console.log (id);

        const car = this.cars.find( car => car.id === id ); //coche cuyo id del coche = id que recibo del argumento
        if ( !car ) throw new NotFoundException(`Car with id '${ id }' not found`); //si el coche no existe, creamos una nueva instancia para lanzar un error personalizado
        
        return car;
    }

    create( createCarDto: CreateCarDto ) {

        const car: Car = {
            id: uuid(),
            ...createCarDto //esparce sus propiedades en este nuevo objeto
            // brand: carDTO.brand,
            // model: carDTO.model
        }

        this.cars.push( car );

        return car;
    }

    update( id: string, updateCarDto: UpdateCarDto ) {

        let carDB = this.findOneById( id ); //existe el coche en la BBDD
        //map devuelva un array de cars
        if( updateCarDto.id && updateCarDto.id !== id ) //si recibo el id y ese id es diferente al que estoy mandando(coche diferente)
            throw new BadRequestException(`Car id is not valid inside body`); //lanza una excepcion

        this.cars = this.cars.map( car => {

            if ( car.id === id ) {
                carDB = { ...carDB, //todos los campos de la BD
                    ...updateCarDto, //se sobreescriben con los campos de la Request
                     id }
                return carDB; //el car modificado
            }
            return car; //el mismo car
        })
        return carDB; //devolvamos el carDB actualizado
    }

    delete( id: string ) {
        const car = this.findOneById( id );
        //con filter recorremos el array y devolvemos todos los coches
        //con id <> al que deseo eliminar
        this.cars = this.cars.filter( car => car.id !== id ); //devuelvo todos los coches donde el id no sea igual al id de la request
        // this.cars = this.cars.filter(car => {
        //     if (car.id != id)
        //         return car
        // } 
    }
}