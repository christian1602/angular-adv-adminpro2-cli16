import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { catchError, map, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

import { environment } from 'src/environments/environment';

import { RegisterForm } from '../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

import { Usuario } from '../models/usuario.model';

declare const google: any;

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  public usuario?: Usuario;

  constructor(private http: HttpClient,
              private router: Router,
              private ngZone: NgZone) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE' {
    return this.usuario?.role ?? 'USER_ROLE';
  }

  get uid(): string {
    return this.usuario?.uid || '';
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token
      }
    };
  }

  guardarLocalStorage(token: string, menu: any){
    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  logout(){
    const email = localStorage.getItem('email')|| ''; // email by google

    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('menu');

    google.accounts.id.revoke(email, () => {
      this.ngZone.run(() => {
        this.router.navigateByUrl('/login');
      });
    });
  }

  validarToken(): Observable<boolean>{
    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) => {
        const { email, google, nombre, role, img = '', uid } = resp.usuario;

        this.usuario = new Usuario(nombre, email, '', img, google, role, uid);

        this.guardarLocalStorage(resp.token,resp.menu);
        return true;
      }),
      catchError( error => of(false)),
    );
  }

  crearUsuario( formData: RegisterForm ){
    return this.http.post(`${ base_url }/usuarios`, formData)
            .pipe(
              tap( (resp: any) => {
                this.guardarLocalStorage(resp.token,resp.menu);
              })
            );
  }

  actualizarPerfil( data: { email: string, nombre: string, role: string }){
    data = {
      ...data,
      role: this.usuario?.role ?? 'USER_ROLE'
    }

    return this.http.put(`${ base_url }/usuarios/${ this.uid }`,data , this.headers);
  }

  login( formData: LoginForm ){
    return this.http.post(`${ base_url }/login`, formData)
            .pipe(
              tap( (resp: any) => {
                this.guardarLocalStorage(resp.token,resp.menu);
              })
            );
  }

  loginGoogle( token: string ){
    return this.http.post(`${base_url}/login/google`, {token})
          .pipe(
            tap( (resp: any) => {
              console.log(resp);
              this.guardarLocalStorage(resp.token,resp.menu);
              localStorage.setItem('email',resp.email);
            })
          );
  }

  cargarUsuarios( desde: number = 0 ){
    // http://localhost:3000/api/usuarios?desde=0
    const url = `${base_url}/usuarios?desde=${desde}`;

    // Con CargarUsuario indica que estoy recbiendo un objeto
    // que tiene una clave usuario que es un arreglo de tipo del modelo usuario pero no son instancias de la clase usuario
    return this.http.get<CargarUsuario>(url, this.headers)
            .pipe(
              map( resp => {
                // Convertimos el array de objetos de tipo usuario en un array de instancias de la clase Usuario
                const usuarios = resp.usuarios.map(
                  user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid ));
                return {
                  total: resp.total,
                  usuarios
                };
              })
            );
  }

  eliminarUsuario(usuario: Usuario){
    // http://localhost:3000/api/usuarios/640bb61a9de1281849499952
    const url = `${base_url}/usuarios/${usuario.uid}`;
    return this.http.delete(url, this.headers);
  }

  guardarUsuario( usuario: Usuario ){
    return this.http.put(`${ base_url }/usuarios/${ usuario.uid }`,usuario , this.headers);
  }
}
