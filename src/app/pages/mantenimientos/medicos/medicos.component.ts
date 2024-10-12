import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Medico } from 'src/app/models/medico.model';

import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {
  public medicos: Medico[] = [];
  public medicosTemp: Medico[] = [];
  public cargando: boolean = true;
  private imgSubs?: Subscription;

  constructor(private medicoService: MedicoService,
              private modalImagenService: ModalImagenService,
              private busquedasService: BusquedasService) { }

  ngOnDestroy(): void {
    this.imgSubs?.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe( img => {
        this.cargarMedicos();
      });
  }

  cargarMedicos(){
    this.cargando = true;
    this.medicoService.cargarMedicos()
      .subscribe( medicos => {
        this.cargando = false;
        this.medicos = medicos;
        this.medicosTemp = medicos;
      });
  }

  abrirModal(medico: Medico){
    if (medico._id) {
      this.modalImagenService.abrirModal('medicos',medico._id,medico.img);
    }
  }

  buscar(termino: string){
    if ( termino.length === 0) {
      this.medicos = this.medicosTemp;
      return;
    }
    this.busquedasService.buscar<Medico>('medicos', termino)
      .subscribe( medicos => {
        this.medicos = medicos;
      });
  }

  borrarMedico(medico: Medico){
    Swal.fire({
      title: '¿Borrar médico?',
      text: `Está a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
        if (medico._id) {
          this.medicoService.borrarMedico(medico._id)
          .subscribe( resp => {
            this.cargarMedicos();
            Swal.fire('Médico borrado',`${medico.nombre} fue eliminado correctamente`, 'success');
          });
        }
      }
    });
  }
}
