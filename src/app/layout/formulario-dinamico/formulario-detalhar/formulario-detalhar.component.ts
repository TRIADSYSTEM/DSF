import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormularioService } from '../formulario.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-formulario-detalhar',
  templateUrl: './formulario-detalhar.component.html',
  styleUrls: ['./formulario-detalhar.component.scss']
})
export class FormularioDetalharComponent implements OnInit {

  // Id do formulario
  idFormulario: number;
  // Id do chamado
  idChamado: number;
  // Formularido com os dados
  formulario: FormGroup;
  // Dados carregados
  formularioDinamico: FormularioDinamico;
  // Campos formulario
  campos: any;
  // Verifica se o formulario ja foi carregado
  pronto: boolean = false;
  // Mensagem erro
  msgErro: string;
  // Renderiza a imagem
  private readonly imageType: string = 'data:image/PNG;base64,';

  constructor(
    private service: FormularioService,
    private spinner: NgxSpinnerService,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    // Configuracoes
    this.carregarConfiguracoes();
    // Dados do formulario
    this.carregarDados();
  }

  /*
   * Carrega as configuracoes
   */
  carregarConfiguracoes() {
    // Carrega o id do chamado
    this.route.params.subscribe(res => {
      this.idChamado = res.idChamado;
      this.idFormulario = res.idFormulario;
    });
  }

  carregarDados() {
    this.spinner.show();
    this.service.carregarDetalheFormulario(this.idFormulario).subscribe(
      dados => {
        if (dados.listaCampos.length > 0) {
          this.formularioDinamico = dados;
          this.campos = dados.listaCampos;
          this.carregarFormulario(dados.mapaCampos);
        } else {
          this.msgErro = "Não foi possível carregar o formulário,"
            + " se o problema persistir, entre em contato com a DFS e"
            + " informe o endereço do atendimento prestado.";
        }

        this.spinner.hide();
      }, error => this.tratarErro(error)
    );
  }

  /*
   * Monta o formulario dinamico
   * @param camposDinamicos
   */
  carregarFormulario(camposDinamicos: any) {
    // Monta o formulario
    this.formulario = this.fb.group(camposDinamicos);
    // Adiciona validacoes
    for (let index = 0; index < this.campos.length; index++) {
      this.adicionarValidacoes(this.campos[index]);
    }
    this.pronto = true;
  }

  /*
   * Adiciona as validacoes nos campos
   * @param campo
   */
  private adicionarValidacoes(campo: any) {
    // Id do formulario
    let idFormulario = this.formularioDinamico.idFormulario;
    // Lista com as validacoes
    let validacao: any[] = [];
    // Campo obrigatorio
    if (campo.campoObrigatorio) {
      validacao.push(Validators.required);
    }
    // Tamanho minimo
    if (campo.tamanhoMinimo != null) {
      validacao.push(Validators.min(campo.tamanhoMinimo));
    }
    // Tamanho maximo
    if (campo.tamanhoMaximo != null) {
      validacao.push(Validators.max(campo.tamanhoMaximo));
    }
    this.formulario.controls[campo.nmCampo].setValidators(validacao);

    // Verifica se o formulario esta no modo de apenas visualizar
    if (idFormulario != null) {
      this.formulario.controls[campo.nmCampo].disable();
    }

    // Corrige o carregamento da data
    if (campo.tpCampo == 'date' && campo.valorPadrao != '') {
      // Carrega a data informada
      let dataCarregada = campo.valorPadrao;
      this.formulario.controls[campo.nmCampo].setValue(new Date(dataCarregada));
    }

    // Carrega o campo de checkbox
    if (campo.tpCampo == 'checkbox' && idFormulario != null) {
      setTimeout(() => {
        this.carregarCheckbox(campo);
      }, 1000);
    }

    // Carrega os dados do multiselect
    if (campo.tpCampo == 'multiselect' && idFormulario != null) {
      this.formulario.controls[campo.nmCampo].setValue(campo.valorPadrao.split("|"));
    }

  }

  /*
 * Carrega os Checkbox
 * @param campo
 */
  carregarCheckbox(campo: any) {
    let valor = campo.valorPadrao.split("|")
    for (var index = 0; index < valor.length; index++) {
      var valorAtual = valor[index];
      for (var lista = 0; lista < campo.listaOpcoes.length; lista++) {
        (document.getElementById(campo.nmCampo + lista) as any).disabled = true
        if (campo.listaOpcoes[lista] == valorAtual) {
          (document.getElementById(campo.nmCampo + lista) as any).checked = true;
          break;
        }
      }
    }
  }

  /*
   * Ajusta o check box
   * @param valor
   * @param nmCampo
   */
  marcarCheckBox(valor: string, nmCampo: string) {
    // Valor do campo
    let valorCampo = this.formulario.controls[nmCampo].value;

    if (valorCampo.indexOf(valor) == -1) {
      valorCampo = valorCampo + valor + "|";
    } else {
      let inicio = valorCampo.indexOf(valor);
      let fim = valor.length + 1;
      valorCampo = valorCampo.replace(valorCampo.substr(inicio, fim), "");
    }

    this.formulario.controls[nmCampo].setValue(valorCampo);
  }


  /*
   * Renderiza a imagem salva
   * @param imagem
   */
  carregarImagem(imagem: string) {
    return this.sanitizer.bypassSecurityTrustUrl(this.imageType + imagem);
  }

  /*
   * Trata o erro das requisicoes
   * @param erro
   */
  tratarErro(erro: any) {
    console.log('Erro formulario => ', erro.message);
    this.pronto = false;
    this.msgErro = "Desculpe, ocorreu um erro ao montar o formulário,"
      + " se o problema persistir entre em contato"
      + " com a DFS e informe o endereço do atendimento prestado.";
    this.spinner.hide();
  }

  /*
   * Faz o download do PDF
   */
  baixar() {
    this.spinner.show();
    this.service.baixarPDF(this.idFormulario).subscribe(
      dados => {
        this.service.handleFile(dados, 'formulario.pdf');
        this.spinner.hide();
      }, error => this.tratarErro(error)
    );
  }

  /**
   * Volta para tela de listagem
   */
  voltarLista() {
    this.router.navigate(['/formulario/listar']);
  }

  /*
   * Volta para pagina inicial
   */
  voltarHome() {
    this.router.navigate(['/home']);
  }

}
