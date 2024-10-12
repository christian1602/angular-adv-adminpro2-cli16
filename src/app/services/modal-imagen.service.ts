import { EventEmitter, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class ModalImagenService {
  private _ocultarModal : boolean = true; // Deesde un comienzo se oculta el modal
  public tipo?: 'usuarios'|'medicos'|'hospitales';
  public id?: string;
  public img?: string;

  public nuevaImagen: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  get ocultarModal(){
    return this._ocultarModal;
  }

  abrirModal(tipo: 'usuarios'|'medicos'|'hospitales', id: string | undefined, img: string = 'no-img'): void {
    if (id){
      this._ocultarModal = false;
      this.tipo = tipo;
      this.id = id;
      //http://localhost:3000/api/upload/usuarios/4d4caa66-3cb1-4d72-9e9f-1b4bd176ce5aa.jpg

      if (img.includes('https')){
        this.img = img;
      } else {
        this.img = `${base_url}/upload/${tipo}/${img}`;
      }
    } else {
      console.error('El ID no puede ser undefined'); // Manejo del error
    }
  }

  cerrarModal(): void {
    this._ocultarModal = true;
  }
}
