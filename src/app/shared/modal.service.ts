import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { SessionModalComponent } from './session-modal/session-modal.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { InputEmailComponent } from './input-email/input-email.component';

export enum AlertTypes {
  DANGER = 'danger',
  SUCCESS = 'success'
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  /*
   * Configuracoes modal envio e-mail
   */
  configInputEmail = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  /*
   *  Configuracoes modal sessao
   */
  configSessao = {
    backdrop: true,
    ignoreBackdropClick: true
  };

  constructor(private service: BsModalService) { }

  /*
   * Exibe o modal de aviso de sessao
   * @param message
   * @param type
   * @param dismissTimeout
   */
  exibirModalSessao(msg: string, title?: string) {
    const bsModalRef: BsModalRef = this.service.show(SessionModalComponent, this.configSessao);
    bsModalRef.content.msg = msg;

    if (title) {
      bsModalRef.content.title = title;
    }

    return (<SessionModalComponent>bsModalRef.content).confirmResult;

  }

  /*
   * Exibe um modal de confirmacao.
   * @param msg
   * @param title
   * @param okTxt
   * @param cancelTxt
   */
  exibirModalConfirmacao(msg: string, title?: string, okTxt?: string, cancelTxt?: string) {
    const bsModalRef: BsModalRef = this.service.show(ConfirmModalComponent);
    bsModalRef.content.msg = msg;

    if (title) {
      bsModalRef.content.title = title;
    }

    if (okTxt) {
      bsModalRef.content.okTxt = okTxt;
    }

    if (cancelTxt) {
      bsModalRef.content.cancelTxt = cancelTxt;
    }

    return (<ConfirmModalComponent>bsModalRef.content).confirmResult;
  }

  /*
   * Carrega o modal para o input do e-mail
   * @param emailCarregado
   */
  exibirModalInputEmail(email: String) {
    const bsModalRef: BsModalRef = this.service.show(InputEmailComponent, this.configInputEmail);
    // Envia o e-mail para o componente
    bsModalRef.content.email = email;
    return (<InputEmailComponent>bsModalRef.content).confirmResult;
  }

}
