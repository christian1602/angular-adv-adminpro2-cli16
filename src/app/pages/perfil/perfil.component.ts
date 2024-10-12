import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';

import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {
  public perfilForm: FormGroup = {} as FormGroup;
  public usuario: Usuario;
  public imagenSubir?: File;
  public imgTemp: any = null;

  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private fileUploadService: FileUploadService ) {
    this.usuario = usuarioService.usuario || new Usuario('', '', '', '', false, 'USER_ROLE', ''); // Asigna un nuevo usuario por defecto
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [ this.usuario.nombre , Validators.required ],
      email: [ this.usuario.email , [ Validators.required, Validators.email ] ]
    });
  }

  actualizarPerfil(){
    this.usuarioService.actualizarPerfil( this.perfilForm.value )
      .subscribe({
        next: resp => {
          console.log(resp);
          const { nombre, email } = this.perfilForm.value;
          this.usuario.nombre = nombre;
          this.usuario.email = email;

          Swal.fire('Guardado', 'Cambios fueron guardados', 'success');
        },
        error: (err) => {
          Swal.fire('Error', err.error.msg, 'error');
        }
      });
  }

  public handleFileInput(event: Event): void{
    // Convierte el target del evento a un elemento de entrada HTML para acceder a la propiedad `files`.
    const input = event.target as HTMLInputElement;
    // Verifica que el input tenga archivos y que el primer archivo no sea nulo.
    if (input.files && input.files[0]){
      this.cambiarImagen(input.files[0]);
    }
  }

  cambiarImagen( file: File ){
    this.imagenSubir = file;

    if (!file){
      this.imgTemp = null;
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL( file );

    reader.onloadend = () => {
      console.log(reader.result); // Devuelve un string en base 64, que se usa para mostrar la imagen
      this.imgTemp = reader.result;
    };
  }

  subirImagen(){
    if (!this.imagenSubir) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "La imagen no es válida"
      });
      return; // Termina la ejecución si tipo es undefined
    }

    if (!this.usuario.uid) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "ID del usuario no válido"
      });
      return; // Termina la ejecución si tipo es undefined
    }

    this.fileUploadService
      .actualizarFoto( this.imagenSubir, 'usuarios', this.usuario.uid )
      .then( (img: any) => {
        this.usuario.img = img;
        Swal.fire('Guardado', 'Imagen de usuario actualizada', 'success');
      }).catch( err => {
        console.log(err);
        Swal.fire('Error', 'No se pudo subir la imagen', 'error');
      });
  }
}
