import { Component, OnInit, ViewChild  } from '@angular/core';
import Swal from 'sweetalert2';

import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {
  public imagenSubir?: File;
  public imgTemp: any = null;

  @ViewChild( 'inputFile' ) inputFile: any;

  constructor(public modalImagenService: ModalImagenService,
              public fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal(){
    this.imgTemp = null;
    this.clearInputFile();
    this.modalImagenService.cerrarModal();
  }

  public handleFileInput(event: Event): void{
    // Convierte el target del evento a un elemento de entrada HTML para acceder a la propiedad `files`.
    const input = event.target as HTMLInputElement;
    // Verifica que el input tenga archivos y que el primer archivo no sea nulo.
    if (input.files && input.files[0]){
      this.cambiarImagen(input.files[0]);
    }
  }

  cambiarImagen( file: File ): void {
    this.imagenSubir = file;

    if (!file){
      this.imgTemp = null;
    } else {
      const reader = new FileReader();
      reader.readAsDataURL( file );

      reader.onloadend = () => {
        console.log(reader.result); // Devuelve un string en base 64, que se usa para mostrar la imagen
        this.imgTemp = reader.result;
      };
    }
  }

  clearInputFile() {
    this.inputFile.nativeElement.value = "";
  }

  subirImagen(){
    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;
    const img = this.modalImagenService.img;

    if (!this.imagenSubir) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se ha seleccionado ninguna imagen"
      });
      return; // Termina la ejecución si no hay imagen
    }

    if (!tipo) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Tipo de imagen no válido"
      });
      return; // Termina la ejecución si no hay imagen
    }

    if (!id) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "ID no válido"
      });
      return; // Termina la ejecución si no hay imagen
    }

    this.fileUploadService
      .actualizarFoto( this.imagenSubir, tipo, id )
      .then( (img: any) => {
        // this.usuario.img = img;
        Swal.fire({
          icon: "success",
          title: "Guardado",
          text: "Imagen de usuario actualizada"
        });
        this.modalImagenService.nuevaImagen.emit(img);
        this.cerrarModal();
      }).catch( err => {
        console.log(err);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo subir la imagen"
        });
      });
  }
}
