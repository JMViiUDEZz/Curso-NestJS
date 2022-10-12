import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid';

import { CreateCarDto, UpdateCarDto } from './dto';
import { Car } from './interfaces/car.interface';

@Injectable()
export class CarsService {

    private cars: Car[] = [
        {
            id: uuid(),
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

        const car = this.cars.find( car => car.id === id );
        if ( !car ) throw new NotFoundException(`Car with id '${ id }' not found`);
        
        return car;
    }

    create( createCarDto: CreateCarDto ) {

        const car: Car = {
            id: uuid(),
            ...createCarDto
            // brand: carDTO.brand,
            // model: carDTO.model
        }

        this.cars.push( car );

        return car;
    }

    update( id: string, updateCarDto: UpdateCarDto ) {

        let carDB = this.findOneById( id );
        //map devuelva un array de cars
        if( updateCarDto.id && updateCarDto.id !== id )
            throw new BadRequestException(`Car id is not valid inside body`);

        this.cars = this.cars.map( car => {

            if ( car.id === id ) {
                carDB = { ...carDB, //todos los campos de la BD
                    ...updateCarDto, //se sobreescriben con los campos de la Request
                     id }
                return carDB; //el car modificado
            }

            return car; //el mismo car
        })
        //devolvamos el carDB actualizado
        return carDB;
    }

    delete( id: string ) {
        const car = this.findOneById( id );
        //con filter recorremos el array y devolvemos todos los coches
        //con id <> al que deseo eliminar
        this.cars = this.cars.filter( car => car.id !== id );
        // this.cars = this.cars.filter(car => {
        //     if (car.id != id)
        //         return car
        // } 
    }
}