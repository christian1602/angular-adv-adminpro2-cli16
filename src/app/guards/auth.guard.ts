import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route, UrlSegment } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private usuarioService: UsuarioService,
              private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean>{      

      // this.usuarioService.validarToken()
      //   .subscribe( resp => {
      //     console.log(resp);          
          
      //   });      
      
      // La función retornará el resultado del observable,
      // es decir, la petición se va a subscribir y el mismo va a manejar el unsubscribe y todo
      return this.usuarioService.validarToken()
              .pipe(
                tap( estaAutenticado => {
                  if ( !estaAutenticado ){
                    this.router.navigateByUrl('/login');
                  }
                })
              );
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | Observable<boolean> | Promise<boolean> {
    return this.usuarioService.validarToken()
              .pipe(
                tap( estaAutenticado => {
                  if ( !estaAutenticado ){
                    this.router.navigateByUrl('/login');
                  }
                })
              );
  }
  
}
