import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { Hospital } from '../../../models/hospital.model';

import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { BusquedasService } from 'src/app/services/busquedas.service';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {
  public hospitales: Hospital[] = [];
  public hospitalesTemp: Hospital[] = []; // Usado para no tener que volver a llamar al endpoint cuando el termino esté vació
  public cargando: boolean = true;
  private imgSubs?: Subscription;

  constructor( private hospitalService: HospitalService,
              private modalImagenService: ModalImagenService,
              private busquedasService: BusquedasService ) { }

  ngOnDestroy(): void {
    this.imgSubs?.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe( img => {
        this.cargarHospitales();
      });
  }

  cargarHospitales(){
    this.cargando = true;

    this.hospitalService.cargarHospitales()
      .subscribe(hospitales => {
        this.cargando = false;
        this.hospitales = hospitales;
        this.hospitalesTemp = hospitales;
      });
  }

  guardarCambios(hospital: Hospital){
    if (hospital._id) {
      this.hospitalService.actualizarHospital(hospital._id, hospital.nombre)
      .subscribe(resp => {
        this.cargarHospitales();
        Swal.fire('Actualizado',hospital.nombre, 'success');
      });
    } else {
      Swal.fire('Error', 'El ID del hospital no está definido.', 'error');
    }
  }

  eliminarHospital(hospital: Hospital){
    if (hospital._id) {
      this.hospitalService.borrarHospital(hospital._id)
      .subscribe(resp => {
        this.cargarHospitales();
        Swal.fire('Borrado',hospital.nombre, 'success');
      });
    } else {
      Swal.fire('Error', 'El ID del hospital no está definido.', 'error');
    }
  }

  async abrirSweetAlert(){
    const {value = ''} = await Swal.fire<string>({
      title: 'Crear hospital',
      input: 'text',
      inputLabel: 'Ingrese el nombre del nuevo hospital',
      inputPlaceholder: 'Nombre del hospital',
      showCancelButton: true
    });

    if (value.trim().length > 0) {
      this.hospitalService.crearHospital(value)
        .subscribe((resp: any) => {
          this.hospitales.push(resp.hospital);
        });
    }
  }

  abrirModal(hospital: Hospital){
    if (hospital._id) {
      this.modalImagenService.abrirModal('hospitales',hospital._id,hospital.img);
    } else {
      Swal.fire('Error', 'El ID del hospital no está definido.', 'error');
    }
  }

  buscar(termino: string ): void{
    if ( termino.length === 0) {
      this.hospitales = this.hospitalesTemp;
      return;
    }

    this.busquedasService.buscar<Hospital>('hospitales', termino)
      .subscribe( resultados => {
        this.hospitales = resultados;
      });
  }
}
