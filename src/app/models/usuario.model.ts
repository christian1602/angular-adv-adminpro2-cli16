import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

export class Usuario{
    constructor(
        public nombre: string,
        public email: string,
        public password?: string,
        public img?: string,
        public google?: boolean,
        public role?: 'ADMIN_ROLE'|'USER_ROLE',
        public uid?: string
    ){}

    get imagenUrl(){
        // /upload/usuarios/4d4caa66-3cb1-4d72-9e9f-1b4bd176ce5aa.jpg
        if ( !this.img ){
            return `${base_url}/upload/usuarios/no-image`;
        } else if ( this.img.includes('https') ) {
            return this.img;
        } else if ( this.img ) {
            return `${base_url}/upload/usuarios/${this.img}`;
        } else {
            return `${base_url}/upload/usuarios/no-image`;
        }
    }
}
