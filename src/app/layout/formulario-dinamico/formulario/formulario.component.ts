import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsLocaleService, BsDatepickerConfig } from 'ngx-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { Component, OnInit } from '@angular/core';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { NgxSpinnerService } from 'ngx-spinner';

import { FormularioService } from '../formulario.service';
import { ModalService } from 'src/app/shared/modal.service';
import { ArquivoUpload } from '../models/arquivo-upload';
import { DomSanitizer } from '@angular/platform-browser';

// Carrega o locale do calendario
defineLocale('pt-br', ptBrLocale);
@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.scss']
})
export class FormularioComponent implements OnInit {

  // Configuracoes do calendario
  bsConfig: Partial<BsDatepickerConfig>;
  // Formularido com os dados
  formulario: FormGroup;
  // Dados carregados
  formularioDinamico: FormularioDinamico;
  // Campos formulario
  campos: any;
  // Id do chamado
  idChamado: number;
  // Id para carregar o formulario
  idCargaFormulario: number;
  // Verifica se o formulario ja foi carregado
  pronto: boolean = false;
  // Mensagem sucesso
  msgSucesso: string;
  // Mensagem erro
  msgErro: string;
  // Lista de arquivos anexados
  listaUpload: Array<ArquivoUpload> = new Array;
  // Renderiza a imagem
  private readonly imageType: string = 'data:image/PNG;base64,';
  // Mensagem de validacao do anexo
  msgValidacaoAnexo: string;

  constructor(
    private localeService: BsLocaleService,
    private service: FormularioService,
    private spinner: NgxSpinnerService,
    private modalService: ModalService,
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
      this.idCargaFormulario = res.idFormulario;
    });
    // Carrega o locale do calendario
    this.localeService.use("pt-br");
    // Carrega o tema do calendario
    this.bsConfig = Object.assign({}, { containerClass: 'theme-default' });
  }

  /*
   * Carrega os dados do formulario
   */
  carregarDados() {
    this.spinner.show();
    this.service.carregarFormulario(this.idChamado, this.idCargaFormulario).subscribe(
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
   * Valida o campo
   * @param nmCampo
   */
  validarCampo(nmCampo: string) {
    const valorCampo = this.formulario.get(nmCampo).status;
    document.getElementById(nmCampo).classList.remove('is-invalid');
    if (valorCampo == 'INVALID') {
      document.getElementById(nmCampo).classList.add('is-invalid');
    }
  }

  /*
   * Seleciona os arquivos que serao enviados
   * @param event
   * @param nomeCampo
   */
  selecionarArquivo(event: any, nomeCampo: string) {
    // Flag que indica se o campo existe
    let campExiste: boolean = false;
    // Posicao do campo na lista
    let posicao: number = 0;
    try {
      // Arquivos anexados
      let arquivo = event.target.files;
      // Objeto de apoio
      var arquivoUpload: ArquivoUpload = new ArquivoUpload();
      // Procura o campo na lista
      for (let lista of this.listaUpload) {
        if (lista.nmCampoUpload == nomeCampo) {
          campExiste = true;
          break;
        }
        posicao++;
      }
      if (arquivo[length] != undefined) {
        // Realiza as validacoes do arquivo
        this.validarFormatoArquivo(arquivo);
        this.validarTamanhoImagem(arquivo);
      }
      // Adiciona ou atualiza o valor
      if (campExiste) {
        this.listaUpload[posicao].arquivoSelecionado = arquivo;
      } else {
        arquivoUpload.nmCampoUpload = nomeCampo;
        arquivoUpload.arquivoSelecionado = arquivo;
        this.listaUpload.push(arquivoUpload);
      }
      // Exibe a imagem
      this.preview(arquivo, nomeCampo);
    } catch (erro) {
      this.listaUpload[posicao].arquivoSelecionado = null;
      (document.getElementById(nomeCampo) as any).value = '';
      this.preview(null, nomeCampo);
      this.modalService.exibirModalSessao(erro);
    }
  }

  /*
   * Rendezira uma demostracao da imagem
   * @param arquivo
   */
  preview(arquivo: any, nomeCampo: string) {
    let imagem: any = "";
    if (arquivo != null && arquivo.length > 0) {
      var reader = new FileReader();
      reader.readAsDataURL(arquivo[0]);
      reader.onload = (_event) => {
        imagem = reader.result;
        (document.getElementById(nomeCampo + 'Preview') as any).src = imagem;
      }
    } else {
      (document.getElementById(nomeCampo + 'Preview') as any).src = imagem;
    }
  }

  /*
   * Valida o formato do arquivo a ser anexado
   * @param arquivo
   */
  validarFormatoArquivo(arquivo: File) {
    let ext = arquivo[0].name.match(/\.(.+)$/)[1];
    if (ext.toLocaleLowerCase() !== 'jpeg' && ext.toLocaleLowerCase() !== 'png'
      && ext.toLocaleLowerCase() !== 'jpg' && ext.toLocaleLowerCase() !== 'mpg'
      && ext.toLocaleLowerCase() !== 'odd') {
      throw `O formato do arquivo " ${arquivo[0].name} " é inválido. Apenas arquivos nos formatos JPEG, PNG e JPG são permitidos.`;
    }
  }

  /*
   * Valida o tamanho do arquivo anexado
   * @param arquivo
   */
  validarTamanhoImagem(arquivo: File) {
    if (arquivo[0].size > 20971520) {
      throw `O tamanho do arquivo " ${arquivo[0].name} " é inválido. Só são permitidos arquivos com no máximo 20MB.`;
    }
  }

  /**
   * Confirma e-mail
   */
  confirmarEmail() {
    // Validacao
    let valido = this.validarEnvioFormulario();
    if (this.formulario.valid && valido) {
      // Exibe o carregando
      this.spinner.show();
      this.service.carregarEmail(this.idChamado).subscribe(
        email => {
          const resultado$ = this.modalService.exibirModalInputEmail(email);
          this.spinner.hide();
          resultado$.asObservable().subscribe(
            email => {
              if (email) {
                (document.getElementById("btnEnviar") as any).disabled = true;
                this.salvar(email);
              }
            }
          );
        }, error => this.tratarErro(error)
      );
    }
  }

  /*
   * Salva o formulario
   */
  async salvar(email: any) {
    // Exibe o carregando
    this.spinner.show();
    // Salva o formulario
    const idform = await new Promise<number>(
      resolve => this.enviarFormulario(resolve)
    );
    // Faz o upload dos arquivos
    await new Promise<any>(
      resolve => this.carregarArquivos(idform, resolve)
    );
    await new Promise<any>(
      resolve => this.enviarEmail(this.idChamado, email, resolve)
    );
    // Para o carregando
    this.spinner.hide();

  }

  /*
   * Salva o formulario
   */
  enviarFormulario(resolve: any) {
    // Carrega os dados do formulario
    this.formularioDinamico.mapaCampos = this.formulario.value;
    // Adiciona o id do chamado ao formulario dinamico
    this.formularioDinamico.idChamado = this.idChamado;
    // Salva o formulario
    this.service.salvarFormulario(this.formularioDinamico).subscribe(
      dados => {
        resolve(dados);
      }, error => this.tratarErro(error));
  }

  /*
   * Carrega as imagens
   * @param idFormulario
   * @param email
   */
  carregarArquivos(idFormulario: number, resolve: any) {
    this.service.carregarArquivos(this.listaUpload, this.idChamado, idFormulario).subscribe(
      resposta => { resolve(resposta) }, error => this.tratarErro(error)
    );
  }

  /*
   * Envia o e-mail
   * @param idFormulario
   * @param email
   */
  enviarEmail(idChamado: number, email: string, resolve: any) {
    this.service.enviarEmail(idChamado, email).subscribe(
      resposta => {
        resolve(resposta);
        // Seta a mensagem
        this.msgSucesso = "Formulário salvo com sucesso.";
        // Recarrega a página
        this.recarregarPagina();
        this.spinner.hide();
      }, error => this.tratarErro(error)
    );
  }

  /*
   * Faz a validacao dos campos do formulário
   */
  validarEnvioFormulario() {
    // Retorna se todos os campos sao validos
    let formularioValido: boolean = true;
    // Verifica se ha algum campo de upload
    let existeCampoUpload: boolean = false;
    //validarCampo
    for (var index = 0; index < this.formularioDinamico.listaCampos.length; index++) {
      let nmCampo = this.formularioDinamico.listaCampos[index].nmCampo;
      let tpCampo = this.formularioDinamico.listaCampos[index].tpCampo;
      if (tpCampo != 'file' && tpCampo != 'description' && tpCampo != 'checkbox') {
        this.validarCampo(nmCampo);
      } if (tpCampo == 'file') {
        existeCampoUpload = true;
      } if (tpCampo == 'multiselect') {
        var valoresConcatenados = "";
        for (let valor of this.formulario.get(nmCampo).value) {
          valoresConcatenados = valoresConcatenados + valor + "|";
        }
        this.formulario.controls[nmCampo].setValue(valoresConcatenados);
      }
    }

    this.msgValidacaoAnexo = "";

    // Valida os arquivos anexados
    if (existeCampoUpload) {
      // Verifica se nao ha nenhum campo
      if (this.listaUpload.length == 0) {
        this.msgValidacaoAnexo = "Todo o campo de anexo dever ser preenchidos.";
        return false;
      }
      for (var index = 0; index < this.listaUpload.length; index++) {
        if (this.listaUpload[index].arquivoSelecionado['length'] == 0) {
          this.msgValidacaoAnexo = "Todo o campo de anexo dever ser preenchidos.";
          return false;
        }
      }
    }

    return formularioValido;

  }

  /*
   * Confirma se o usuario deseja realmente reabrir o chamado
   */
  confirmarReabrir() {
    const resultado$ = this.modalService.
      exibirModalConfirmacao("Deseja realmente reabrir o chamado?  Todos os dados associados a ele serão perdidos, essa operação não poderá ser desfeita. ");
    resultado$.asObservable().subscribe(
      dados => {
        if (dados) {
          (document.getElementById("btnReabrir") as any).disabled = true;
          this.reabrir();
        }
      }
    );
  }

  /*
   * Reabre o chamado
   */
  reabrir() {
    // Exibe o carregando
    this.spinner.show();
    this.service.reabrirChamado(this.formularioDinamico).subscribe(
      resposta => {
        // Seta a mensagem
        this.msgSucesso = "Formulário reaberto com sucesso.";
        if (resposta.codigoRetorno == 0) {
          // Recarrega a página
          this.recarregarPagina();
        }
        this.spinner.hide();
      }, error => this.tratarErro(error)
    );
  }

  /*
   * Renderiza a imagem salva
   * @param imagem
   */
  carregarImagem(imagem: string) {
    return this.sanitizer.bypassSecurityTrustUrl(this.imageType + imagem);
  }

  /*
   * Reenvia o e-mail para o usuario.
   */
  reenviarEmail() {
    // Exibe o carregando
    this.spinner.show();
    this.service.carregarEmail(this.idChamado).subscribe(
      email => {
        const resultado$ = this.modalService.exibirModalInputEmail(email);
        this.spinner.hide();
        resultado$.asObservable().subscribe(
          (email: any) => {
            if (email) {
              // Exibe o carregando
              this.spinner.show();
              this.service.reenviarEnviarEmail(this.idChamado, email).subscribe(
                () => {
                  // Seta a mensagem
                  this.msgSucesso = "E-mail foi reenviado com sucesso.";
                  // Recarrega a página
                  this.recarregarPagina();
                  this.spinner.hide();
                }, error => this.tratarErro(error)
              );

            }
          }
        );
      }, error => this.tratarErro(error)
    );
  }

  /*
   * Recarrega a pagina
   */
  recarregarPagina() {
    setTimeout(() => {
      location.reload();
    }, 2000);
  }

  /*
   * Trata o erro das requisicoes
   * @param erro
   */
  tratarErro(erro: any) {
    console.log('Erro formulario => ', erro);
    this.pronto = false;
    this.msgErro = "Desculpe, ocorreu um erro ao montar o formulário,"
      + " se o problema persistir entre em contato"
      + " com a DFS e informe o endereço do atendimento prestado.";
    this.spinner.hide();
  }

  /*
   * Volta para pagina inicial
   */
  voltarHome() {
    this.router.navigate(['/home']);
  }

}
