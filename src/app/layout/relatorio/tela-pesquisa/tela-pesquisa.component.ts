import { ptBrLocale, defineLocale, BsDatepickerConfig, BsLocaleService } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { RelatorioService } from '../relatorio.service';
import { registerLocaleData } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

import localePt from '@angular/common/locales/pt';
registerLocaleData(localePt);

import { FormularioGerar } from '../models/formulario-gerar';

// Carrega o locale do calendario
defineLocale('pt-br', ptBrLocale);
@Component({
  selector: 'app-tela-pesquisa',
  templateUrl: './tela-pesquisa.component.html',
  styleUrls: ['./tela-pesquisa.component.scss']
})
export class TelaPesquisaComponent implements OnInit {

  // Exibe a mensagem de acesso negado
  acessoNegado: boolean = false;
  // Formulario
  formulario: FormGroup;
  // Configuracoes do calendario
  bsConfig: Partial<BsDatepickerConfig>;
  // Mensagem validacao consulta
  msgConsulta: string;
  // Lista com os grupos carregados
  listaGrupo: any = [];
  // Lista com as entidades
  listaEntidade: any = [];
  // Lista com as localizacoes
  listaLocalizacao: any = [];
  // Exibe o carregando da localizacao
  carregandoLoc: boolean = false;
  // Lista com os dados pesquisados
  listaCusto: any = [];
  // Valor total
  valorTotal: number = 0;
  // Total de itens carregados
  totalCustor: number = 0;
  // Mensagem custo
  msgCusto: string;

  constructor(
    private service: RelatorioService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private fb: FormBuilder,
    private localeService: BsLocaleService
  ) { }

  ngOnInit() {
    // Carrega os dados da pagina
    this.carregarConfiguracoes();
    // Carrega os dados
    this.carregarDados();
  }

  /*
   * Carrega as configuracoes
   */
  carregarConfiguracoes() {
    // Monta o formulario
    this.carregarFormulario();
    // Carrega o locale do calendario
    this.localeService.use("pt-br");
    // Carrega o tema do calendario
    this.bsConfig = Object.assign({}, { containerClass: 'theme-orange' });
  }

  /*
   * Monsta os dados do formulario
   */
  carregarFormulario() {
    // Data inicio
    let d = new Date();
    d.setDate(d.getDate() - 29);
    this.formulario = this.fb.group({
      dataInicio: [d, [Validators.required]],
      dataFinal: [new Date(), [Validators.required]],
      nmChamado: [""],
      tpChamado: ['T', [Validators.required]],
      grupoChamado: [-1, [Validators.required]],
      entidade: [-1, [Validators.required]],
      localizacao: [-1, [Validators.required]]
    });
  }

  /*
   * Valida o acesso do usuario a esta tela
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
   * Carrega as informacoes dos selects
   */
  async carregarDados() {
    // Exibe o carregando
    this.spinner.show();
    // Valida o acesso
    const carregar = await new Promise<boolean>(
      resolve => this.validarAcesso(resolve)
    );
    // Verifica se o sistema pode carregar os dados
    if (carregar) {
      forkJoin([
        this.service.carregarGrupos(),
        this.service.carregarEntidades()
      ]).subscribe(
        allResults => {
          this.listaGrupo = allResults[0];
          this.listaEntidade = allResults[1];
          this.spinner.hide();
        },
        () => {
          this.spinner.hide();
        }
      );
    }
  }

  /*
   * Verifica o tipo de chamado
   * @param nmTipo
   */
  carregarTipo(nmTipo: number) {
    switch (nmTipo) {
      case 1:
        return "Atendimento";
      case 2:
        return "Vistoria";
      case 3:
        return "Instalação";
      default:
        return "Desconhecido"
    }
  }

  /*
   * Carrega as localizacoes
   */
  carregarLocalizacao() {
    // Valor da entidade informada
    let idEntidade = this.formulario.get('entidade').value;
    // Exibe o carregando
    this.carregandoLoc = true;
    // Seta o valor do form
    this.formulario.patchValue({
      localizacao: -1
    });
    // Limpa a lista
    this.listaLocalizacao = [];
    this.service.carregarLocalizacao(idEntidade).subscribe(
      localizacoes => {
        this.listaLocalizacao = localizacoes;
        // Para o carregando
        this.carregandoLoc = false;
      },
      () => {
        // Para o carregando
        this.carregandoLoc = false;
      }
    );
  }

  /*
   * Valida o intervalo das datas
   */
  validarData() {
    let dataInicio: Date = this.formulario.get('dataInicio').value;
    let dataFinal: Date = this.formulario.get('dataFinal').value;
    if (dataInicio.getTime() < dataFinal.getTime()) {
      return true;
    }
    this.msgConsulta = "A data início deve ser menor que a data final.";
    return false;
  }

  /*
   * Valida o numero do chamado informado
   * @param valor
   */
  validarNumero(valor: any) {
    this.msgConsulta = "";
    if (valor.indexOf(";") == 0) {
      this.msgConsulta = "O número do chamado informado é inválido.";
    }
    valor = valor.replace(/;/g, "");
    let numero = !isNaN(parseFloat(valor)) && isFinite(valor);
    if (!numero && valor.length > 0) {
      this.msgConsulta = "O número do chamado informado é inválido.";
    }
  }

  /*
   * Faz a consulta dos dados
   */
  consultar() {
    // Limpa as mensagens
    this.msgConsulta = "";
    this.msgCusto = "";
    if (this.formulario.valid && this.validarData()) {
      this.spinner.show();
      this.service.consultar(this.formulario.value).subscribe(
        lista => {
          this.listaCusto = lista;
          // Seta o total de itens retornados
          this.totalCustor = this.listaCusto.length;
          // Soma o valor total
          this.valorTotal = 0;
          for (let dado of this.listaCusto) {
            this.valorTotal += dado.vlTotal;
          }
          // Verifica se nao retornou nenhum valor e exibe a mensagem
          if (this.totalCustor == 0) {
            this.msgCusto = "A consulta com os filtros informados não retornou nenhum resultado.";
          }
          this.spinner.hide();
        },
        error => this.tratarErro(error)
      );
    }
  }

  /**
   *  Reseta o formulario
   */
  limpar() {
    // Data inicio
    let d = new Date();
    d.setDate(d.getDate() - 29);
    this.formulario.patchValue({
      dataInicio: d,
      dataFinal: new Date(),
      nmChamado: "",
      tpChamado: 'T',
      grupoChamado: -1,
      entidade: -1,
      localizacao: -1
    });
    // Limpa a lista de localizacao
    this.listaLocalizacao = [];
    // Limpa dados custo
    this.limparDadosTabela();
  }

  limparDadosTabela() {
    // Limpa as mensagens
    this.msgConsulta = null;
    this.msgCusto = null;
    // Limpa os dados da lista Custo
    this.listaCusto = [];
    this.totalCustor = 0;
    this.totalCustor = 0;
  }

  /*
   * Exibe as entidades
   */
  exibeEntidade() {
    var select = (document.getElementById('entidadeChamado') as any);
    var value = select.options[select.selectedIndex].text;
    return value;
  }

  /*
   * Exibe a localizacao do chamado
   */
  exibirLocalizacao() {
    var select = (document.getElementById('localizacaoChamado') as any);
    if (select == null) {
      return 'Todas';
    }
    var value = select.options[select.selectedIndex].text;
    return value;
  }

  baixarPDF() {
    this.spinner.show();
    // Monta um objeto para gerar o PDF
    var gerarPdf: FormularioGerar = new FormularioGerar();
    gerarPdf.dataInicio = this.formulario.get('dataInicio').value;
    gerarPdf.dataFinal = this.formulario.get('dataFinal').value;
    gerarPdf.entidadeSelec = this.exibeEntidade();
    gerarPdf.localizacaoSelec = this.exibirLocalizacao();
    gerarPdf.totalChamados = this.totalCustor;
    gerarPdf.custoTotal = this.valorTotal;
    gerarPdf.listaCusto = this.listaCusto;

    // Faz o download
    this.service.baixarPDF(gerarPdf).subscribe(
      dados => {
        let nmArquivo = "Relatorio de Custo_" + this.formatarData(gerarPdf.dataInicio) + "A" + this.formatarData(gerarPdf.dataFinal) + ".pdf";
        this.service.handleFile(dados, nmArquivo);
        this.spinner.hide();
      }, error => this.tratarErro(error)
    );
  }

  /*
   * Formata a data para exibir no nome do arquivo
   * @param valor
   */
  formatarData(valor: any) {
    let dia = ("00" + valor.getDate()).slice(-2);
    let mes = ("00" + (valor.getMonth() + 1)).slice(-2);
    let ano = ("0000" + valor.getFullYear()).slice(-4);
    return dia + "-" + mes + "-" + ano;
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
