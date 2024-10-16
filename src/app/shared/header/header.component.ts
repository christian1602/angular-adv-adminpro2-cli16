import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from 'src/app/models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {

  public usuario: Usuario;

  constructor( private usuarioService: UsuarioService,
              private router: Router ) {
    this.usuario = usuarioService.usuario || new Usuario('', '', '', '', false, 'USER_ROLE', ''); // Asigna un nuevo usuario por defecto
  }

  logout(){
    this.usuarioService.logout();
  }

  buscar(termino: string){
    if (termino.length === 0){
      return;
    }
    this.router.navigateByUrl(`/dashboard/buscar/${termino}`);
  }
}
