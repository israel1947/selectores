import { HttpClient} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { Pais, PaisSmall } from '../interfaces/paises.interface';

@Injectable({
  providedIn: 'root'
})
export class PaisesService {

  private _regiones:string[]=['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];

  private baseUrl:string='https://restcountries.com/v2'//url de la llamada de la api

 


  get regiones (){
    return [...this._regiones]//al desectructurar la propiedad _regiones, estoy evitando cualquier cambio en el arreglo original
  }
  constructor(private http:HttpClient) { }

  getpaisesByRegion(region:string):Observable<PaisSmall[]>{

    const url:string=`${this.baseUrl}/region/${region}?fields=name,alpha3Code`//url de la llamada a la api + los campos que deseo mostrar

    return  this.http.get<PaisSmall[]>(url);//llamado de toda la url completa(url api + url con campos a mostrar)
  }

  //recibir el codigo(ej:COL) del pais seleccionado
  getPaisByCode( codigo:string ):Observable<Pais | null>{
    if(!codigo){
      return of(null);
    }
    const url:string= `${this.baseUrl}/alpha/${codigo}`;
    return this.http.get<Pais>(url);
  }

  //recibir el nombre y el codigo del pais seleccionado
  getPaisCodigoSmall( codigo:string ):Observable<PaisSmall>{
    const url:string= `${this.baseUrl}/alpha/${codigo}?fields=name,alpha3Code`;
    return this.http.get<PaisSmall>(url);
  }

  //hacer poeticion por el codigo y el nombre del pais
  getPaisesPorBorder(borders:string[]):Observable<PaisSmall[]>{

    if(!borders){
      return  of ([]);//si  no existe el border retornara un arreglo vacio
    }
    //retorno de la frontera por su nombre y codigo
    const peticiones:Observable<PaisSmall>[] = [];
    borders.forEach(codigo=>{
      //peticion de las fronteras por el codigo
      const peticion = this.getPaisCodigoSmall(codigo);
      //inyeccion de la peticion hacia el arreglo de  paisSmall
      peticiones.push(peticion);
    });

    return combineLatest(peticiones);
  }

}
