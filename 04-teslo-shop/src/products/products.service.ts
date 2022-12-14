import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { Product, ProductImage } from './entities';
import { validate as isUUID } from 'uuid';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService'); //creamos una propiedad dentro de la clase

  constructor(

    @InjectRepository(Product) //inyectamos nuestra Entidad
    private readonly productRepository: Repository<Product>, //maneja el repositorio de nuestro producto

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource, //tiene la misma configuracion que productRepository(funciona igual)

  ) {}

  async create(createProductDto: CreateProductDto) {
    
    try {
      //en este caso ... es operador rest. El resto de propiedades caen en productDetails
      const { images = [], ...productDetails } = createProductDto; //todas las propiedades excepto las imagenes se definiran en el createProductDto
      //crea la instancia del producto con sus propiedades
      const product = this.productRepository.create({
        //en este caso ... es operador spread
        ...productDetails,
        //images: [] //En este caso, no tenemos ninguna imagen creada. Sin embargo, si tuvieramos alguna, estas tienen que ser instancias de nuestra entidad de ProductImage, como se muestra a continuacion:
        
        images: images.map( image => this.productImageRepository.create({ url: image }) ) //creo las instancias de productImageRepository que se encuentran dentro del productRepository y cuando grabe el product, el id que le asigna a cada producto sera el id que tendran las imagenes de los mismos
        //map: barre un Array y regresa uno nuevo transformado
      });
      //lo graba e impacta en la BBDD
      await this.productRepository.save( product ); //salva tanto el producto como las imagenes, ya que estas se encuentran dentro del producto
      return { ...product, images }; //devolver?? las imagenes a la BDD con la misma estructura que tenian en el body de la request: 
      // "images": [
      //   "http://image1.jpg",
      //   "http://image2.jpg"
      // ]
      
    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  async findAll( paginationDto: PaginationDto ) {

    const { limit = 10, offset = 0 } = paginationDto; //valores por defecto que tomar??n si no vienen especificados en la consulta
    //En resumen, toma los productos desde limit y salta el offset
    const products = await this.productRepository.find({ //almacena todos los productos en products 
      take: limit, //toma la cantidad de productos que se especifica en limit
      skip: offset, //saltate la cantidad de productos que se especifica en offset
      relations: { //relaciones que quiero ver/llenar en la request de la tabla de products
        images: true, //llena las imagenes
      }
    })
    //Aplanar las imagenes (1?? FORMA)
    return products.map( ( product ) => ({ //map: transforma un array en otra cosa
      ...product,
      images: product.images.map( img => img.url ) //del img solo regresa el url
    }))
  }

  async findOne( term: string ) { //(termino de busqueda) term: uuid/slug/title

    let product: Product; //crear producto de tipo Product (Entity)

    if ( isUUID(term) ) { //si el termino es un UUID
      product = await this.productRepository.findOneBy({ id: term }); //lo busca por el UUID,
    } else { //si no lo es
      // product = await this.productRepository.findOneBy({ slug: term }); //lo busca por el slug
      const queryBuilder = this.productRepository.createQueryBuilder('prod'); //con este ultimo metodo ya sabe a que tabla estoy apuntado (Products) y muchas cosas mas de la BDD
      //'prod' --> alias de la tabla Products donde se hace el query(consulta)

      //select * from Products where slug='XX or title=xxxx'
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', { //argumentos proporcionados (title pasado a mayuscula o slug que como se pasa en minuscula no hace falta pasarlo)al where:
          title: term.toUpperCase(), //pasamos el termino(title) a mayuscula
          slug: term.toLowerCase(), //pasamos el termino(slug) a minuscula
        })
        .leftJoinAndSelect('prod.images', //especificamos la tabla que se va a relacionar
        'prodImages') //especificamos un alias por si con estas imagenes queremos hacer otro join
        .getOne(); //puede ser que regrese 2 productos, por lo que con este metodo solo obtendra 1
    }
    // const product = await this.productRepository.findOneBy({ id });

    if ( !product ) 
      throw new NotFoundException(`Product with ${ term } not found`);

    return product;
  }

  //Metodo para Aplanar las imagenes (2?? FORMA)
  async findOnePlain( term: string ) {
    const { images = [], ...rest } = await this.findOne( term );
    return {
      ...rest,
      images: images.map( image => image.url )
    }
  }

  async update( id: string, updateProductDto: UpdateProductDto ) {

    //preload busca un objeto de la BD, y se fusiona con la destructuraci??n del dto
    //se devuelve un objeto resultante de la combinaci??n de propiedades
    const { images, ...toUpdate } = updateProductDto; //extraemos las imagenes(pueden venir nulas) y la data a actualizar

    //preload busca un objeto de la BD, y se fusiona con la destructuraci??n del dto
    //se devuelve un objeto resultante de la combinaci??n de propiedades
    const product = await this.productRepository.preload({ //busca el producto por el id y carga todas las propiedades del updateProductDto
      id, ...toUpdate 
    });

    if ( !product ) throw new NotFoundException(`Product with id: ${ id } not found`);

    // Si hay Imagenes, tendremos que Borrarlas de una manera controlada:
    // Create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      //si vienen imagenes de la reques (dto) --> las borro de product_images
      if( images ) { //si vienen imagenes
        await queryRunner.manager.delete( //las borramos todas
          ProductImage //entidad/tabla que va a ser afectada
          , { product: { id } } //criterio/filtro --> si no lo ponemos, borrara todas las imagenes de la tabla (delete * from ProductImage) ??CUIDADO!
          );
        //ponemos las nuevas imagenes que vienen en la request (dto), pero no las guarda
        product.images = images.map( //regresa un nuevo array
          image => this.productImageRepository.create({ url: image }) //crea instancias de mi ProductImage, aunque no las impacta en la BDD
        )
      } 
      // else {
      //hemos de cargar de product-images las im??genes relacionadas que hubiera
      //   product.images = await this.productImageRepository.findBy({ product: { id } })
      // }

      // await this.productRepository.save( product ); //guarda el producto
      await queryRunner.manager.save( product ); //lo guarda/impacta en la BDD

      await queryRunner.commitTransaction(); //si no hay errores hasta aqui, aplica los cambios
      await queryRunner.release(); //el queryRunner ya no volvera a funcionar 

      // return product;
      return this.findOnePlain( id );
      
    } catch (error) {

      await queryRunner.rollbackTransaction(); //si hay errores, NO aplica los cambios
      await queryRunner.release(); //el queryRunner ya no volvera a funcionar 
      this.handleDBExceptions(error);

    }

  }

  async remove(id: string) {
    const product = await this.findOne( id );
    await this.productRepository.remove( product );
    
  }

  //Hemos creado un metodo privado para este tipo de error, ya que lo vamos a tener en cuenta para eliminar, actualizar, crear, etc.
  private handleDBExceptions( error: any ) {

    if ( error.code === '23505' ) //si el codigo de error es 23505
      throw new BadRequestException(error.detail); //sera un BadRequestException
    
    //si no lo es, podremos agregar debajo todos los posibles errores centralizados:
    this.logger.error(error)
    // console.log(error)
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
  //Eliminacion de todos los productos en cascada
  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      return await query
        .delete() //borra todos los registros de la tabla Product en cascada
        .where({}) //no le mandamos ninguna condiccion, por lo que seleccionamos todos los productos
        .execute();

    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

}
