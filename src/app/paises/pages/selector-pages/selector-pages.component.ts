import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import{switchMap, tap} from 'rxjs/operators'

import { PaisesService } from '../../services/paises.service';
import { PaisSmall, Pais } from '../../interfaces/paises.interface';
import { pipe } from 'rxjs';

@Component({
  selector: 'app-selector-pages',
  templateUrl: './selector-pages.component.html',
  styles: [
  ]
})
export class SelectorPagesComponent implements OnInit {

  miFormulario:FormGroup=this.formBuilder.group({

    region:['',Validators.required],
    pais:['', Validators.required],
    frontera:['',Validators.required],
  })

  //llenar selectores
  regiones:string[]=[];
  paises:PaisSmall[]=[];
  //fronteras:string[]=[];
  fronteras:PaisSmall[]=[];

  //carga de espera de la pagina
  cargando:boolean=false;

  constructor(private formBuilder:FormBuilder,
              private paisesService:PaisesService) { }

  ngOnInit(): void {

    this.regiones = this.paisesService.regiones;
    
      //cuando cambia de region 
      this.miFormulario.get('region')?.valueChanges//el swirchMap toma el observable  de get('region')?.valueChanges y hace el cambio "de el viejo por el nuevo" es decir la primera seleccion la cambia por la nueva seleccion
           .pipe(
            tap( (_)=>{
              this.miFormulario.get('pais')?.reset('')//el tap permite reiniciar el campo de pais  siempre y cuando se cambie el valor de el input de continente
              this.cargando=true;//aparece el alert de cargando mientras que arroja el resultado de la data
            }),
            switchMap(region => this.paisesService.getpaisesByRegion(region) )
           )

          .subscribe(paises=>{
            this.paises=paises
            this.cargando=false;//desaparece alert de cargando cuando se optiene la data
            //console.log(paises)
          })

     //cuando cambia de país
     this.miFormulario.get('pais')?.valueChanges//optencion del primer observable
       .pipe(
         tap((_)=>{
           this.miFormulario.get('frontera')?.reset('');//resetear la frontera cuando se haga un cambio de region
           this.cargando=true;
          }),
         switchMap(codigo => this.paisesService.getPaisByCode(codigo)),//modificacion de la respuesta optenida previamente
         switchMap(pais=> this.paisesService.getPaisesPorBorder(pais?.borders!))//pais como argumento es el producto del observable de codigo.
       )
       .subscribe(paises =>{
        // this.fronteras=pais?.borders || [];
        this.fronteras = paises;//esto son los paises que se reciben como arguimento en el suscribe
         this.cargando=false;
         console.log(paises);
       })
  }

  guardar(){
   console.log(this.miFormulario.value);
  }

}


//pais?.borders! quiere decir que puede ser nula y en caso contrario siempre tendra un borde(frontera)