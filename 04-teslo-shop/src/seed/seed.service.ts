import { Injectable } from '@nestjs/common';
import { ProductsService } from './../products/products.service';
import { initialData } from './data/seed-data';


@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService
  ) {}


  async runSeed() {

    await this.insertNewProducts();

    return 'SEED EXECUTED';
  }

  private async insertNewProducts() {
    await this.productsService.deleteAllProducts(); //elimina toda la data de la BDD

    const products = initialData.products; //tomamos toda la data en products

    const insertPromises = [];

    products.forEach( product => { //con cada uno de estos productos
      insertPromises.push( this.productsService.create( product ) ); //espera a que cada una de estas promesas se resuelvan
    });

    await Promise.all( insertPromises ); //ejecuta el array con cada uno de los valores que cada una de estas promesas resuelva


    return true;
  }


}