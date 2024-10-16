import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';

import { HospitalService } from '../../../services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {
  public medicoForm: FormGroup = {} as FormGroup;
  public hospitales: Hospital[] = [];
  public hospitalSeleccionado?: Hospital;
  public medicoSeleccionado?: Medico;

  constructor(private fb: FormBuilder,
              private hospitalService: HospitalService,
              private medicoService: MedicoService,
              private router: Router,
              private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params
      .subscribe(({ id }) => {
        this.cargarMedico(id);
    });

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required ],
      hospital: ['', Validators.required ]
    });

    this.cargarHospitales();

    this.medicoForm.get('hospital')?.valueChanges
      .subscribe( hospitalId => {
        this.hospitalSeleccionado = this.hospitales.find( h => h._id === hospitalId);
      });
  }

  cargarMedico(id: string){
    if (id === 'nuevo'){
      return;
    }

    this.medicoService.obtenerMedidoPorId(id)
      .pipe(
        delay(100)
      )
      .subscribe( medico => {
        if ( !medico ){
          this.router.navigateByUrl(`/dashboard/medicos`);
          return;
        }

        const  { nombre, hospital } = medico;
        this.medicoSeleccionado = medico;
        this.medicoForm.setValue({nombre, hospital: hospital?._id });
      });
  }

  cargarHospitales(){
    this.hospitalService.cargarHospitales()
      .subscribe( (hospitales: Hospital[]) => {
        this.hospitales = hospitales;
      });
  }

  guardarMedico(){
    // console.log(this.medicoSeleccionado);
    const { nombre } = this.medicoForm?.value;

    if (this.medicoSeleccionado) {
      // Actualizar
      const data = {
        ...this.medicoForm?.value,
        _id: this.medicoSeleccionado._id

      };

      this.medicoService.actualizarMedico(data)
        .subscribe((resp: any) => {
          Swal.fire('Actualizado', `${ nombre } actualizado correctamente`,'success');
        });
    } else {
      // Crear
      this.medicoService.crearMedico(this.medicoForm?.value)
        .subscribe( (resp: any) => {
          Swal.fire('Creado', `${ nombre } creado correctamente`,'success');
          this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
        });
    }
  }
}
