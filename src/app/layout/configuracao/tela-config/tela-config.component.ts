import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

import { ConfiguracaoService } from '../configuracao.service';

@Component({
  selector: 'app-tela-config',
  templateUrl: './tela-config.component.html',
  styleUrls: ['./tela-config.component.scss']
})
export class TelaConfigComponent implements OnInit {

  // Exibe a mensagem de acesso negado
  acessoNegado: boolean = false;
  // Exibir mensagem envio
  exibirMsg: boolean = false;

  constructor(
    private service: ConfiguracaoService,
    private spinner: NgxSpinnerService,
    private router: Router,
  ) { }

  ngOnInit() {
    // Carrega os dados
    this.carregarDados();
  }

  /*
   * Carrega os dados da tela
   */
  async carregarDados() {
    // Exibe o carregando
    this.spinner.show();
    // Valida o acesso
    await new Promise<boolean>(
      resolve => {
        this.validarAcesso(resolve);
      });
      this.spinner.hide();
  }

  /*
   * Valida o acesso do usuario a esta tela
   * @param resolve
   */
  validarAcesso(resolve: any) {
    let token = localStorage.getItem("token");
    this.service.validarAcesso(token).subscribe(
      () => resolve(true),
      error => {
        this.acessoNegado = true;
        resolve(false);
        this.tratarErro(error);
      }
    );
  }

  /*
   * Carrega os formularios
   */
  carregarFormulario() {
    this.service.carregarFormulario().subscribe();
    this.exibirMensagem();
  }

  /*
   * Aprova os chamados expirados
   */
  aprovarChamados() {
    this.service.aprovarChamados().subscribe();
    this.exibirMensagem();
  }

  /*
   * Exibe a mensagem para o usuario
   */
  exibirMensagem() {
    this.exibirMsg = true;
    setTimeout(() => {
      this.exibirMsg = false;
    }, 10000);
  }

  /*
   * Volta para pagina inicial
   */
  voltarHome() {
    this.router.navigate(['/home']);
  }

  /*
   * Trata os erro de carregamento da pagina
   * @param error
   */
  tratarErro(error: any) {
    this.spinner.hide();
    if (error.status == 403) {
      this.acessoNegado = true;
    }
  }

}
