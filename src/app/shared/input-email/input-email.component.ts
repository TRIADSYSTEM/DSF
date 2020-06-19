import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-input-email',
  templateUrl: './input-email.component.html',
  styleUrls: ['./input-email.component.scss']
})
export class InputEmailComponent implements OnInit {
  @Input() title: String = "DFS Field Service";
  // Email carregado pelo sistema
  @Input() email: string = "";
  // Cria um formulario para os dados do login
  formulario: FormGroup;
  /**
   * Verifica qual acao foi realizada no modal
   */
  confirmResult: Subject<String>;
  /*
   * Lista com os e-mails adicionados
   */
  listaEmails: Array<string> = [];

  constructor(
    private bsModalRef: BsModalRef,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    // Carrega o formulario
    this.carregarFormulario();
    // Carrega a resposta
    this.confirmResult = new Subject();
    // Exibe um e-mail pre cadastrado se houver
    setTimeout(() => {
      if (this.email != null && this.email != "") {
        this.listaEmails.push(this.email);
      }
    }, 100);
  }

  /*
   * Carrega o formulario
   */
  carregarFormulario() {
    this.formulario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  /*
   * Atualiza o valor do e-mail do formulario
   */
  adicionarEmail(valor: string) {
    if (this.formulario.controls.email.valid) {
      this.listaEmails.push(valor);
      this.formulario.controls['email'].setValue("");
    }
  }

  /*
   * remove o item da lista
   * @param valor
   */
  removerEmail(valor: string) {
    const index: number = this.listaEmails.indexOf(valor);
    if (index !== -1) {
      this.listaEmails.splice(index, 1);
    }
  }

  /*
   * Envia o e-mail
   */
  enviar() {
    // Concatena os e-mails para enviar
    let emails: string = "";
    for (var index = 0; index < this.listaEmails.length; index++) {
      emails = emails + this.listaEmails[index] + "&";
    }
    this.confirmarEFechar(emails);
  }

  /* Cancela a opercao
   *
   */
  fechar() {
    this.confirmarEFechar(null);
  }

  /*
   * Envia a resposta para o componente
   * @param value
   */
  private confirmarEFechar(value: String) {
    this.confirmResult.next(value);
    this.bsModalRef.hide();
  }

}
