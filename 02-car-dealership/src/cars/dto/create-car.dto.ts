import { IsString } from "class-validator";

//Dto: En esencia, es como una interfaz(estructura de los datos) que, a su vez, valida los datos que vienen de la request --> Por ello, sustituiremos la Interfaz por el Dto (podremos eliminar la interfaz de nuestro proyecto, ya que en su lugar declararemos el Dto)
export class CreateCarDto {
    //todos los campos obligatorios a la hora de insertar
    @IsString() //validador
    readonly brand: string; //todos suelen ser readonly, para que salga un error si accidentalmente hacemos alguna modificacion

    @IsString()
    readonly model: string; //readonly: impide la modificacion de los datos del parametro al pasar por la api(controlador y servicio) --> Por tanto, solamente valida la data (solo lectura)
    id: number;
    
}