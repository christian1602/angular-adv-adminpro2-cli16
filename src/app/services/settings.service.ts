import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private linkTheme = document.querySelector('#theme');

  constructor() {
    const url = localStorage.getItem('theme');
    const urlDefault = `./assets/css/colors/purple-dark.css`;

    if (url){
      this.linkTheme?.setAttribute('href',url);
    } else {
      this.linkTheme?.setAttribute('href',urlDefault);
    }
  }

  changeTheme(theme: string){
    const url = `./assets/css/colors/${theme}.css`;
    this.linkTheme?.setAttribute('href',url);
    localStorage.setItem('theme',url);
    this.checkCurrentTheme();
  }

  checkCurrentTheme(){
    const links = document.querySelectorAll('.selector');

    links.forEach(elem =>{
      elem.classList.remove('working');
      const btnTheme = elem.getAttribute('data-theme');
      const btnThemeUrl = `./assets/css/colors/${btnTheme}.css`;
      const currentTheme = this.linkTheme?.getAttribute('href');

      if (btnThemeUrl === currentTheme){
        elem.classList.add('working');
      }
    });
  }
}
