import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { forkJoin } from "rxjs";

import { HomeService } from './home.service';
import { Agenda } from './agenda';
import { Home } from './home';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // Exibe os dados do usuario na tela principal
  home: Home;
  // Dados da agenda não confimada
  agendaNaoConfirmado: Array<Agenda> = [];
  // Dados da agenda não confimada
  agendaConfirmado: Array<Agenda> = [];
  // Mensagem que sera exibida no modal
  mensagemValidacao: String;

  constructor(
    private homeService: HomeService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    // Carrega os dados do CARD com as informacoes do usuario
    this.carregarDadosCard();
    //Carrega os dados da agenda nao confirmada
    this.carrgarDadosAgenda();
  }

  /*
   * Carrega os dados do usuario
   */
  private carregarDadosCard() {
    this.home = new Home();
    this.home.dataAtual = new Date();
    this.home.nome = localStorage.getItem('primeiroNome');
    this.home.loja = localStorage.getItem('loja');
    this.home.endereco = localStorage.getItem('endereco');
    this.home.cep = localStorage.getItem('cep');
    this.home.cidade = localStorage.getItem('cidade');
    this.home.uf = localStorage.getItem('estado');
    this.home.complemento = localStorage.getItem('complemento');
  }

  /*
   * Carrega os dados da agenda
   */
  private carrgarDadosAgenda() {
    this.spinner.show();
    let id = localStorage.getItem('id');
    forkJoin([
      this.homeService.carregarAgendaNaoConfirmada(id),
      this.homeService.carregarAgendaConfirmada(id)
    ]).subscribe(
      allResults => {
        this.agendaNaoConfirmado = allResults[0];
        this.agendaConfirmado = allResults[1];
        this.spinner.hide();
      }, error => {
        this.erroCarregar(error, "Erro ao carregar os dados.");
        this.agendaNaoConfirmado = [];
        this.agendaConfirmado = [];
      }
    );
  }

  /*
   * Faz a confirmacao do chamado.
   * @param ticketId
   */
  confirmarAgendamento(ticketId: Number) {
    this.spinner.show();
    this.homeService.confirmarAgendamento(ticketId, localStorage.getItem('id')).subscribe(
      dados => {
        if (dados.codigoRetorno == 1) {
          // Mensagem para o usuario
          this.exibirModalMensagem("O chamado " + ticketId + " foi confirmado com sucesso.");
        } else {
          // Mensagem para o usuario
          this.exibirModalMensagem("Erro ao confirmar o chamado " + ticketId);
        }
        // Carrega os chamados novamente.
        this.carrgarDadosAgenda();
      }, error => {
        this.erroCarregar(error, "Erro ao confirmar o chamado.");
      }
    );
  }

  /*
   * Faz o reagendamento do chamado.
   * @param idChamado
   */
  reagendarAgendamento(ticketId: Number) {
    this.spinner.show();
    this.homeService.reagendarAgendamento(ticketId).subscribe(
      dados => {
        if (dados.body["codigoRetorno"] == 1) {
          // Mensagem para o usuario
          this.exibirModalMensagem("O chamado " + ticketId + " foi reagendado com sucesso.");
        } else {
          // Mensagem para o usuario
          this.exibirModalMensagem("Erro ao reagendar o chamado" + ticketId);
        }
        // Carrega os chamados novamente.
        this.carrgarDadosAgenda();
      }, error => {
        this.erroCarregar(error, "Erro ao reagendar o chamado.");
      }
    );
  }

  /*
   * Deixa o primeiro indice carregado
   * @param indice
   */
  carregarExpansivo(indice: number) {
    if (indice == 0) {
      return true;
    }
    return false;
  }

  /*
   * Carrega os formularios
   * @param idChamado
   */
  carregarFormularioInstalacao(idChamado: number, idFormulario: number) {
    this.router.navigate([`formulario/${idChamado}/${idFormulario}`]);
  }

  /*
   * Abre a tela de chat desse chamado
   * @param idChamado
   */
  abrirChat(idChamado: number) {
    this.router.navigate([`chat/${idChamado}`]);
  }

  /*
   * Exibe as mensagens
   * @param mensagemErro
   */
  exibirModalMensagem(mensagemErro: String) {
    this.mensagemValidacao = mensagemErro;
    document.getElementById('btnModalValidacao').click();
  }

  /*
   * Exibe a mensagem de erro
   * @param erro
   * @param mensagemErro
   */
  erroCarregar(erro: any, mensagemErro: String) {
    console.debug(erro.message);
    this.spinner.hide();
    // Mensagem para o usuario
    this.mensagemValidacao = mensagemErro;
    document.getElementById('btnModalValidacao').click();
  }

}
