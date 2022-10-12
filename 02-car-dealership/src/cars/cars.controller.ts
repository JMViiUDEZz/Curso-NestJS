import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@Controller('cars')
// @UsePipes( ValidationPipe )
export class CarsController {
  
  constructor(
    private readonly carsService: CarsService
  ) {}

  @Get() //endpoint http://localhost:3000/cars
  getAllCars() { //accion
    return this.carsService.findAll()
  }

  @Get(':id') //endpoint http://localhost:3000/cars/3
  //@Get(':id/:name/:edad') varios parámetros en la url
  getCarById( @Param('id', ParseUUIDPipe ) id: string ) { //accion
    return this.carsService.findOneById( id ); //Number(id)
    // console.log (id);
  }

  @Post()
  createCar( @Body() createCardDto: CreateCarDto ) {
    // dataCreateDTO.brand = 'volvo';
    return this.carsService.create( createCardDto );
  }

  @Patch(':id')
  updateCar( 
    @Param('id', ParseUUIDPipe ) id: string, 
    @Body() updateCarDto: UpdateCarDto ) 
  {
    return this.carsService.update( id, updateCarDto );
  }

  @Delete(':id')
  deleteCar( @Param('id', ParseUUIDPipe ) id: string ) {
    return this.carsService.delete( id )
  }

}