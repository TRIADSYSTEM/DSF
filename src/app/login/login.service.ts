import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';

import { Usuario } from './usuario';
import { ApplicationPropertiesService } from '../application.properties.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // Link do login
  login: string = this.urlRequisicao.urlRequisicao() + 'login';

  // Link do logout
  logout: string = this.urlRequisicao.urlRequisicao() + 'login/logout';

  constructor(
    private http: HttpClient,
    private urlRequisicao: ApplicationPropertiesService
  ) { }

  fazerLogin(usuario: Usuario) {
    this.resetaToken();
    return this.http.post<Usuario>(this.login, usuario).pipe(take(1));
  }

  fazerLogout() {
    return this.http.get<any>(`${this.logout}/${localStorage.getItem('session')}`).pipe(take(1));
  }

  resetaToken() {
    localStorage.setItem('token', '');
  }

}
