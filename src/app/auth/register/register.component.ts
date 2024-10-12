import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent{
  public formSubmitted = false;

  public registerForm: FormGroup = this.fb.group({
    nombre: ['Christian', Validators.required ],
    email: ['test100@mail.com', [ Validators.required, Validators.email ] ],
    password: ['123456', Validators.required ],
    password2: ['123456', Validators.required ],
    terminos: [true, Validators.required ],
  },{
    validators: this.passwordsIguales('password', 'password2')
  });

  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private router: Router) { }

  crearUsuario(){
    this.formSubmitted = true;
    console.log( this.registerForm.value );

    if ( this.registerForm.invalid ){
      return;
    }

    // Realizar el posteo
    this.usuarioService.crearUsuario( this.registerForm.value )
      .subscribe( resp => {
        console.log('Usuario creado');
        // Navegar al dashboard
        this.router.navigateByUrl('/');
      }, (err) => {
        console.log('err',err);

        // Originalmente estaba solo esta linea
        // Swal.fire('Error', err.error.msg, 'error');

        // Inicio de Opcionalmente
        let msg = '';

        if (err.error.errors){
          // Los errores provenientes de la validación de los campos del formulario
          // Vienen en el objeto err.error.errors
          // console.log('err', Object.entries(err.error.errors));
          // console.log('err',err.error.errors.nombre.msg);
          // console.log('err',err.error.errors.email.msg);

          for (const key in err.error.errors) {
            if (Object.prototype.hasOwnProperty.call(err.error.errors, key)) {
              const element = err.error.errors[key];
              msg += element.msg + '<br>';
            }
          }
        } else if (err.error){
          // Los errores validados en la función crearUsuario del controlador de usuarios,
          // Vienen en el objeto err.error
          // console.log('err', err.error.msg);
          msg += err.error.msg
        }
        // Fin de Opcionalmente

        // Si sucede un error
        Swal.fire('Error', msg, 'error');
      });
  }

  campoNoValido( campo: string ): boolean{
    if ( this.registerForm.get(campo)?.invalid && this.formSubmitted ){
      return true;
    } else {
      return false;
    }
  }

  aceptaTerminos(){
    return !this.registerForm.get('terminos')?.value && this.formSubmitted;
  }

  contrasenasNoValidas(){
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('password2')?.value;

    if ( (pass1 !== pass2) && this.formSubmitted ){
      return true;
    } else {
      return false;
    }
  }

  passwordsIguales(pass1Name: string, pass2Name: string){
    // Por ser una validación debe regresar una función.
    // Si la función cumple su objetivo, entonces devuelve un error seteado en null
    // Si la función no cumple su objetivo, entonces devuelve un error seteado en un objeto


    return ( formGroup: FormGroup ) => {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if ( pass1Control?.value === pass2Control?.value ){
        pass2Control?.setErrors(null);
      } else {
        pass2Control?.setErrors({ noEsIgual: true });
      }
    };

  }
}
