import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';

import { ApplicationPropertiesService } from 'src/app/application.properties.service';
import { Resposta } from '../resposta';

@Injectable({
  providedIn: 'root'
})
export class FormularioService {

  // Link para carregar o formulario
  urlCarregarFormulario: string = this.urlRequisicao.urlRequisicao() + 'formulario/carregar';

  // Link para salvar os dados do formulario
  urlSalvarFormulario: string = this.urlRequisicao.urlRequisicao() + 'formulario/salvar';

  // Link para reabrir o chamado
  urlReabrirFormulario: string = this.urlRequisicao.urlRequisicao() + 'formulario/reabrir';

  // Link para fazer o upload dos arquivos anexados.
  urlCarregarArquivos: string = this.urlRequisicao.urlRequisicao() + 'formulario/upload';

  // Link para carregar o e-mail.
  urlCarregarEmail: string = this.urlRequisicao.urlRequisicao() + 'formulario/email';

  // Envia o link para o backend para validacao
  urlValidarLink: string = this.urlRequisicao.urlServe + "formulario/validar";

  // Altera o status do chamado para finalizado
  urlFinalizarChamado: string = this.urlRequisicao.urlServe + "formulario/validar/chamado";

  // Reprova o chamado
  urlReprovarChamado: string = this.urlRequisicao.urlServe + "formulario/validar/reprovar";

  // Lista os formularios
  urlListarForemulario: string = this.urlRequisicao.urlServe + "formulario/listar";

  // Link para carregar o formulario
  urlDetalharFormulario: string = this.urlRequisicao.urlRequisicao() + 'formulario/carregar/detalhe';

  // Url para enviar o e-mail
  urlEnviarEmail: string = this.urlRequisicao.urlRequisicao() + 'formulario/email/enviar';

  // Url para enviar o e-mail
  urlReenviarEnviarEmail: string = this.urlRequisicao.urlRequisicao() + 'formulario/email/reenviar';

  // Url para enviar o e-mail
  urlBaixarPDF: string = this.urlRequisicao.urlRequisicao() + 'formulario/download/pdf';

  constructor(
    private http: HttpClient,
    private urlRequisicao: ApplicationPropertiesService
  ) { }

  /*
   * Carrega o formulario
   * @param idChamado
   */
  carregarFormulario(idChamado: number, idCargaFormulario: number) {
    return this.http.get<FormularioDinamico>(`${this.urlCarregarFormulario}/${idChamado}/${idCargaFormulario}`).pipe(take(1));
  }

  /*
   * Salva o do formulario
   * @param formularioDinamico
   */
  salvarFormulario(formularioDinamico: FormularioDinamico) {
    return this.http.post<any>(`${this.urlSalvarFormulario}`, formularioDinamico).pipe(take(1));
  }

  /*
   * Faz o upload dos arquivos selecionados.
   * @param arquivos
   * @param idChamado
   */
  carregarArquivos(arquivos: any, idChamado: any, idFormulario: any) {
    const formdata: FormData = new FormData();
    // Id chamado
    formdata.append('idChamado', idChamado);
    // Id do Formulario
    formdata.append('idFormulario', idFormulario);
    // Adiciona as imagens
    for (let index = 0; index < arquivos.length; index++) {
      formdata.append('arquivos', arquivos[index].arquivoSelecionado[0]);
      formdata.append('nmCampos', arquivos[index].nmCampoUpload);
    }
    if (arquivos.length == 0) {
      formdata.append('nmCampos', "");
    }
    return this.http.post(this.urlCarregarArquivos, formdata, {
      reportProgress: true,
      responseType: 'text',
      observe: 'events',
    });
  }

  /*
   * Reabre o formulario preenchido
   * @param formularioDinamico
   */
  reabrirChamado(formularioDinamico: FormularioDinamico) {
    return this.http.post<Resposta>(this.urlReabrirFormulario, formularioDinamico).pipe(take(1));
  }

  /*
   * Carrega o e-mail do usuario que abriu o chamado.
   * @param formulario
   */
  carregarEmail(idChamado: number) {
    return this.http.get<any>(`${this.urlCarregarEmail}/${idChamado}`).pipe(take(1));
  }

  /*
 * Valida se o link é valido
 * @param link
 */
  validarLink(linkValidacao: any) {
    return this.http.get<ValidaLink>(`${this.urlValidarLink}/${linkValidacao}`).pipe(take(1));
  }

  /*
   * Finaliza o chamado
   * @param link
   */
  finalizarChamado(validaLink: any) {
    return this.http.post<Resposta>(`${this.urlFinalizarChamado}`, validaLink).pipe(take(1));
  }

  /*
   * Reprova o chamado
   * @param formulario
   */
  reprovarChamado(validaLink: any) {
    return this.http.post<Resposta>(this.urlReprovarChamado, validaLink).pipe(take(1));
  }

  listarFormularios() {
    return this.http.get<any>(this.urlListarForemulario).pipe(take(1));
  }

  /*
   * Carrega o formulario que sera detalhado
   * @param idFormulario
   */
  carregarDetalheFormulario(idFormulario: number) {
    return this.http.get<FormularioDinamico>(`${this.urlDetalharFormulario}/${idFormulario}`).pipe(take(1));
  }

  /*
   * Envia o e-mail
   * @param idFormulario
   * @param email
   */
  enviarEmail(idChamado: any, email: string) {
    return this.http.get<any>(`${this.urlEnviarEmail}/${idChamado}/${email}`).pipe(take(1));
  }

  /*
   * Reenvia o e-mail
   * @param idChamado
   * @param email
   */
  reenviarEnviarEmail(idChamado: any, email: string) {
    return this.http.get<any>(`${this.urlReenviarEnviarEmail}/${idChamado}/${email}`).pipe(take(1));
  }

  /*
   * Cria o PDF para fazer o download
   * @param idFormulario
   */
  baixarPDF(idFormulario: any) {
    return this.http.get(`${this.urlBaixarPDF}/${idFormulario}`, {
      responseType: 'blob' as 'json'
    });
  }

  /*
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
