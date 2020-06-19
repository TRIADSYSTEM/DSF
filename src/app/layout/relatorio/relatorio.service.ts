import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';

import { ApplicationPropertiesService } from 'src/app/application.properties.service';
import { FormularioGerar } from './models/formulario-gerar';

@Injectable({
  providedIn: 'root'
})
export class RelatorioService {

  /*
   * Url para validar acesso a pagina de relatorios
   */
  urlValidarAcesso: string = this.urlRequisicao.urlServe + "custo/validar";

  /*
   * Url para consultar os dados
   */
  urlConsultar: string = this.urlRequisicao.urlServe + "custo/consultar";

  /*
   * Url para carregar os grupos
   */
  urlCarregarGrupos: string = this.urlRequisicao.urlServe + "custo/carregar/grupos";

  /*
   * Url para carregar as entidades
   */
  urlCarregarEntidades: string = this.urlRequisicao.urlServe + "custo/carregar/entidades";

  /*
   * Url para carregar as localizacoes da entidade informada
   */
  urlCarregarLocalizacao: string = this.urlRequisicao.urlServe + "custo/carregar/localizacao";

  /*
   * Url para baixar o PDF
   */
  urlParaBaixarPdf: string = this.urlRequisicao.urlServe + "custo/baixar/pdf";

  constructor(
    private http: HttpClient,
    private urlRequisicao: ApplicationPropertiesService
  ) { }

  /*
   * Valida o acesso a funcionalidade de relatorios
   * @param idUsuario
   */
  validarAcesso(tokenLogin: any) {
    return this.http.post(`${this.urlValidarAcesso}`, {
      session_token: tokenLogin
    }).pipe(take(1));
  }

  /*
   * Consulta os dados dos custos
   * @param formulario
   */
  consultar(formulario: any) {
    return this.http.post(`${this.urlConsultar}`, formulario).pipe(take(1));
  }

  /*
   * Carrega os grupos cadastrados
   */
  carregarGrupos() {
    return this.http.get(`${this.urlCarregarGrupos}`).pipe(take(1));
  }

  /*
   * Carrega as entidades
   */
  carregarEntidades() {
    return this.http.get(`${this.urlCarregarEntidades}`).pipe(take(1));
  }

  /*
   * Carrega as localizacoes da entidade informada
   * @param idEntidade
   */
  carregarLocalizacao(idEntidade: number) {
    return this.http.get(`${this.urlCarregarLocalizacao}/${idEntidade}`).pipe(take(1));
  }

  /*
   * Gera o PDF para baixar
   * @param gerarPdf
   */
  baixarPDF(gerarPdf: FormularioGerar) {
    return this.http.post(`${this.urlParaBaixarPdf}`, gerarPdf, {
      responseType: 'blob' as 'json'
    }).pipe(take(1));
  }

  /**
   * Faz o download do PDF
   * @param res
   * @param fileName
   */
  handleFile(res: any, fileName: string) {
    const file = new Blob([res], {
      type: res.type
    });

    // IE
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(file);
      return;
    }

    const blob = window.URL.createObjectURL(file);

    const link = document.createElement('a');
    link.href = blob;
    link.download = fileName;

    // link.click();
    link.dispatchEvent(new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    }));

    setTimeout(() => { // firefox
      window.URL.revokeObjectURL(blob);
      link.remove();
    }, 100);
  }

}
