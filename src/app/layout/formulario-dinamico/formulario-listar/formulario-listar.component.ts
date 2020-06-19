import { Component, OnInit } from '@angular/core';
import { FormularioService } from '../formulario.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap';

@Component({
  selector: 'app-formulario-listar',
  templateUrl: './formulario-listar.component.html',
  styleUrls: ['./formulario-listar.component.scss']
})
export class FormularioListarComponent implements OnInit {

  // Lista com os formularios
  listaFormulario: FormularioDinamico[];

  contentArray: any;
  returnedArray: string[];

  constructor(
    private service: FormularioService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit() {
    // Carrega os dados
    this.carregarChamados();
  }

  /*
   * Troca a pagina
   * @param event
   */
  pageChanged(event: PageChangedEvent): void {
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this.returnedArray = this.contentArray.slice(startItem, endItem);
  }

  /*
   * Carrega os dados do chamado
   */
  carregarChamados() {
    this.spinner.show();
    this.service.listarFormularios().subscribe(
      dados => {
        this.listaFormulario = dados;
        // Carrega o total de itens
        this.contentArray = new Array(this.listaFormulario.length).fill('');
        this.contentArray = this.listaFormulario.map(
          (formulario: any) =>
            '<div class="list-group" '
            + ">"
            + '<div class="list-group-item list-group-item-action" '
            + 'id="' + formulario.idFormulario + '">'
            + "<div class='d-flex w-100 justify-content-between'>"
            + "<h5 class='mb-1'>Chamado " + formulario.idChamado + "</h5>"
            + "<small></small>"
            + "</div>"
            + "<p class='mb-1'> " + "Título: " + formulario.nomeFormulario + "</p>"
            + "<small></small>"
            + "Status: " + this.montarStatusFormulario(formulario.status)
            + "<div style='float: right; margin-top: -4.2em;'>"
            + "Data: " + this.formatarData(formulario.dtCriacao)
            + "</div>"
            + "</div>"
            + "</div>"
        );
        this.returnedArray = this.contentArray.slice(0, 10);
        this.spinner.hide();
      }, error => this.tratarErro(error)
    );
  }

  /*
   * Formata a data para exibir na tela
   * @param valor
   */
  formatarData(valor: any) {
    if (valor != null) {
      let ano = valor.substring(0, 4);
      let mes = valor.substring(5, 7);
      let dia = valor.substring(8, 10);
      let hora = valor.substring(11, 13);
      let minuto = valor.substring(14, 16);
      return dia + "/" + mes + "/" + ano + " " + hora + ":" + minuto;
    }
    return "<font style='color: red;'> Indisponível </font>";
  }

  /*
   * Mostra o status do chamado
   * @param valor
   */
  montarStatusFormulario(valor: number) {

    switch (valor) {
      case 0:
        return "<font class='text-success'> Aberto - Não confirmado </font>";
      case 1:
        return "<font class='text-success'> Aprovado </font>";
      case 2:
        return "<font class='text-danger'> Não aprovado </font>";
      case 3:
        return "<font class='text-danger'> Reaberto - Pelo técnico </font>";
      default:
        return "<font class='text-danger'> Desconhecido </font>";
    }
  }

  /*
   * Realiza a busca dos chamados
   * @param valor
   */
  buscarChamado(valor: any) {
    // Limpa o mapa
    this.contentArray = [];
    for (let lista of this.listaFormulario) {
      var buscar = "" + lista.idChamado;
      if (buscar.search(valor) != -1) {
        this.contentArray.push(
          '<div class="list-group" '
          + ">"
          + '<div class="list-group-item list-group-item-action" '
          + 'id="' + lista.idFormulario + '">'
          + "<div class='d-flex w-100 justify-content-between'>"
          + "<h5 class='mb-1'>Chamado " + lista.idChamado + "</h5>"
          + "<small></small>"
          + "</div>"
          + "<p class='mb-1'> " + "Título: " + lista.nomeFormulario + "</p>"
          + "<small></small>"
          + "Status: " + this.montarStatusFormulario(lista.status)
          + "<div style='float: right; margin-top: -4.2em;'>"
          + "Data: " + this.formatarData(lista.dtCriacao)
          + "</div>"
          + "</div>"
          + "</div>"
        );
      }
    }

    // Atuliza a lista na tela
    this.returnedArray = this.contentArray.slice(0, 10);
  }

  /*
   * Trata o erro das requisicoes
   * @param erro
   */
  tratarErro(erro: any) {
    console.debug('Erro formulario => ', erro);
    this.listaFormulario = [];
    this.spinner.hide();
  }

  /*
   * Volta para pagina inicial
   */
  voltarHome() {
    this.router.navigate(['/home']);
  }

  /**
   * Carrega a pagina de detalhe do formulario
   * @param idFormulario
   */
  carregarFormulario(idFormulario: number) {
    this.router.navigate([`formulario/listar/detalhe/${idFormulario}`]);
  }

}
