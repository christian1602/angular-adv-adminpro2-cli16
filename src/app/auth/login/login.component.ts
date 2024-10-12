import { Component, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const google:any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit{
  @ViewChild('googleBtn') googleBtn!: ElementRef;

  public formSubmitted = false;

  public loginForm: FormGroup = this.fb.group({
    email: [ localStorage.getItem('email') || '', [ Validators.required, Validators.email ] ],
    password: ['', Validators.required ],
    remember: [false]
  });

  constructor(private router: Router,
              private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private ngZone: NgZone) { }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit(){
    google.accounts.id.initialize({
      client_id: "42200106849-b4trfoicgkhntljiviccu0s62ilcg0d3.apps.googleusercontent.com",
      // callback: this.handleCredentialResponse
      callback: (response: any) => this.handleCredentialResponse(response) // Al pasar el argumento response, mantenemos el this apuntando a LoginComponent
    });
    google.accounts.id.renderButton(
      // document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  handleCredentialResponse( response: any ){
    // console.log({esto:this});
    // console.log("Encoded JWT ID token: " + response.credential);
    this.usuarioService.loginGoogle(response.credential)
      .subscribe(resp => {
        // console.log({ login: resp });
        // Navegar al dashboard
        this.ngZone.run(() => {
            this.router.navigateByUrl('/');
        });
        //this.router.navigateByUrl('/');
      });
  }

  login(){
    this.usuarioService.login( this.loginForm.value )
      .subscribe({
        next: (resp) => {
          if ( this.loginForm.get('remember')?.value ) {
            localStorage.setItem('email', this.loginForm.get('email')?.value );
          } else {
            localStorage.removeItem('email');
          }
          // Navegar al dashboard
          this.router.navigateByUrl('/');
        },
        error: (err) => {// Si sucede un error
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: err.error.msg
          });
        }
      });
    // console.log(this.loginForm.value);
    // this.router.navigateByUrl('/');
  }
}
