import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';

import { ApplicationPropertiesService } from 'src/app/application.properties.service';

@Injectable({
  providedIn: 'root'
})
export class ConfiguracaoService {

  /*
   * Url para validar acesso a pagina de relatorios
   */
  urlValidarAcesso: string = this.urlRequisicao.urlServe + "carga/validar";

  /*
   * Url para carregar os formularios
   */
  urlCargaFormulario: string = this.urlRequisicao.urlServe + "carga/formulario";

  /*
   * Url para aprovar automaticamento os chamados
   */
  urlAprovarChamados: string = this.urlRequisicao.urlServe + "carga/aprovacao";

  constructor(
    private http: HttpClient,
    private urlRequisicao: ApplicationPropertiesService
  ) { }

  /*
   * Valida o acesso a funcionalidade de relatorios
   * @param tokenLogin
   */
  validarAcesso(tokenLogin: any) {
    return this.http.post(`${this.urlValidarAcesso}`, {
      session_token: tokenLogin
    }).pipe(take(1));
  }

  /*
   * Carrega os dados do formulario
   */
  carregarFormulario() {
    return this.http.get(`${this.urlCargaFormulario}`).pipe(take(1));
  }

  /*
   * Aprova os chamados automaticamente
   */
  aprovarChamados() {
    return this.http.get(`${this.urlAprovarChamados}`).pipe(take(1));
  }


}
