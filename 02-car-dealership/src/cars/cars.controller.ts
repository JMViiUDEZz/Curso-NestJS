import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Controller('cars')
// @UsePipes( ValidationPipe )
export class CarsController {
  //inyeccion de dependencias se genera en el constructor
  constructor(
    //inyectamos el servicio en el constructor
    private readonly carsService: CarsService
  ) {}

  @Get() //endpoint http://localhost:3000/cars
  getAllCars() { //accion/metodo
    return this.carsService.findAll() //llamada de dicha funcion del servicio
  }

  @Get(':id') //endpoint http://localhost:3000/cars/3
  //@Get(':id/:name/:edad') varios parámetros/argumentos en la url
  getCarById( @Param('id' //accion/metodo (el decorador @Param lee el id)
  , ParseUUIDPipe //transforme un string a un UUID y valida que la data sea un UUID
  ) id: string ) { 
    return this.carsService.findOneById( id ); //Number(id)
    // console.log (id);
  }

  @Post() //crea un recurso (manda informacion al backend)
  createCar( @Body() createCardDto: CreateCarDto ) { //obtener el body de la peticion
    // dataCreateDTO.brand = 'volvo';
    return this.carsService.create( createCardDto );
  }

  @Patch(':id') //actualiza un recurso
  updateCar( 
    @Param('id', ParseUUIDPipe ) id: string, //obtener/recibir el id de la peticion
    @Body() updateCarDto: UpdateCarDto ) //obtener/recibir el body de la peticion
  {
    return this.carsService.update( id, updateCarDto );
  }

  @Delete(':id')
  deleteCar( @Param('id', ParseUUIDPipe ) id: string ) {
    return this.carsService.delete( id )
  }

}