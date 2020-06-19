import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs/operators';
import { RecuperarSenha } from './recuperar-senha';
import { ApplicationPropertiesService } from 'src/app/application.properties.service';

@Injectable({
  providedIn: 'root'
})
export class RecuperarSenhaService {

  // Link do login
  senha: string = this.urlRequisicao.urlRequisicao() + 'recuperarSenha';

  // Link da validacao do token
  validacao: string = this.urlRequisicao.urlRequisicao() + 'recuperarSenha/validacao';

  // Link com a nova senha
  novaSenha: string = this.urlRequisicao.urlRequisicao() + 'recuperarSenha/alterarSenha';

  constructor(
    private http: HttpClient,
    private urlRequisicao: ApplicationPropertiesService
  ) {}

  /**
   * Envia os dados para a recuperacao da senha
   * @param email
   */
  recuperarSenha(email: string) {
    return this.http.get<RecuperarSenha>(`${this.senha}/${email}`).pipe(take(1));
  }

  /**
   * Valida o token para redefinir a senha
   * @param token
   */
  validarToken(token: string) {
    localStorage.setItem('token', "");
    return this.http.get<RecuperarSenha>(`${this.validacao}/${token}`).pipe(take(1));
  }

  /**
   * Altera a senha
   * @param senha
   */
  alterarSenha(dadosRecuperarSenha: RecuperarSenha) {
    return this.http.post<RecuperarSenha>(this.novaSenha , dadosRecuperarSenha).pipe(take(1));
  }

}
