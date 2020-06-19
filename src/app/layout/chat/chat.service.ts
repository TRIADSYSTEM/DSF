import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ApplicationPropertiesService } from 'src/app/application.properties.service';
import { take } from 'rxjs/operators';
import { Chat } from './chat';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  // Carrega as informacoes do chat
  urlCarregarChat: string = this.urlRequisicao.urlRequisicao() + 'chat';

  // Envia uma nova mensagem para o chat
  urlEnviarMensagem: string = this.urlRequisicao.urlRequisicao() + 'chat/enviar';

  // Faz o upload dos arquivos
  urlUploadArquivos: string = this.urlRequisicao.urlRequisicao() + 'chat/upload';

  // Faz o download dos arquivos do chat
  urlBaixarArquivoChat: string = this.urlRequisicao.urlRequisicao() + 'chat/download';

  constructor(
    private http: HttpClient,
    private urlRequisicao: ApplicationPropertiesService
  ) { }

  /*
   * Carrega os dados do chat
   * @param idChamado
   */
  carregarChat(idChamado: number) {
    return this.http.get<Chat[]>(`${this.urlCarregarChat}/${idChamado}`).pipe(take(1));
  }

  /*
   * Envia uma nova mensagem para o chat
   * @param mensagem
   */
  enviarMensagem(mensagem: any) {
    return this.http.post(this.urlEnviarMensagem, mensagem).pipe(take(1));
  }

  /*
   * Faz o upload dos arquivos
   * @param arquivos
   * @param idChamado
   * @param nmPasta
   */
  carregarArquivos(arquivos: any, idChamado: any, nmPasta: any) {
    const formdata: FormData = new FormData();
    // Id chamado
    formdata.append('idChamado', idChamado);
    // Id chamado
    formdata.append('nmPasta', nmPasta);
    // Id do usuario
    formdata.append('idUsuario', localStorage.getItem('id'));
    // Dados sessao
    formdata.append('session', localStorage.getItem('session'));
    // Adiciona as imagens
    for (let index = 0; index < arquivos.length; index++) {
      formdata.append('arquivos', arquivos[index])
    }
    return this.http.post(this.urlUploadArquivos, formdata, {
      reportProgress: true,
      responseType: 'text',
      observe: 'events',
    });
  }

  /*
   * Baixa o arquivo
   * @param idDocumento
   * @param session
   */
  baixarItem(idDocumento: number, session: string) {
    return this.http.get(`${this.urlBaixarArquivoChat}/${idDocumento}/${session}`, {
      responseType: 'blob' as 'json'
    });
  }

}
