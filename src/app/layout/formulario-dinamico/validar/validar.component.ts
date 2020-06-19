import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/login/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

import { Usuario } from 'src/app/login/usuario';
import { FormularioService } from '../formulario.service';

@Component({
  selector: 'app-validar',
  templateUrl: './validar.component.html',
  styleUrls: ['./validar.component.scss']
})
export class ValidarComponent implements OnInit {

  // Link validacao
  linkValidacao: string;
  // Dados do link
  validaLink: ValidaLink;
  // Mensagem retorno
  mensagemErro: boolean = false;
  // Mensagem da confirmacao
  mensagemConfirmacao: string;
  // Verifica se mostra o contador
  exibirContador: boolean = false;
  // Label contador
  contador: number = 10;
  // Armazena o item que fica atualizando na tela
  interval: any;
  // Verifica se deve ser exibido o campo para reprovacao do chamado
  exibeReprovacao: boolean = false;
  // Cria um formulario para os dados do login
  formulario: FormGroup;
  // Mensagem validacao do formulario
  validacaoFormulario: boolean = false;

  constructor(
    private service: FormularioService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    // Carrega os dados
    this.carregarDados();
    // Carrega Formulario
    this.carregarFormulario();
    // Limpa os dados da sessao
    // this.limparDadosSessao();
    // Valida o link
    this.validarLink();
  }

  /*
   * Carrega os dados do chamado
   */
  carregarDados() {
    // Carrega o link
    this.linkValidacao = this.route.snapshot.paramMap.get('linkValidacao');
  }

  /*
   * Carrega os dados do formulario
   */
  carregarFormulario() {
    this.formulario = this.fb.group({
      idChamado: [0, [Validators.required]],
      idFormulario: [0, [Validators.required]],
      comentarioReprovacao: ['', [Validators.required]]
    });
  }

  /**
   * Valida se os dados passados no link sao validos
   */
  validarLink() {
    this.spinner.show();
    this.service.validarLink(this.linkValidacao).subscribe(
      dados => {
        this.validaLink = dados;
        // Carrega os dados do formulario
        this.formulario.setValue({
          idChamado: this.validaLink.idChamado,
          idFormulario: this.validaLink.idFormulario,
          comentarioReprovacao: ''
        });
        this.spinner.hide();
      }
      , error => this.tratarErro(error)
    );
  }

  /*
   * Limpa os dados da sessao
   */
  limparDadosSessao() {
    this.authService.carregarDadosSessao(new Usuario());
    localStorage.setItem('token', '');
    localStorage.setItem('usuarioAutenticado', '');
    this.authService.mostrarMenuEmitter.emit(false);
  }

  /*
   * Confirma o chamado passado
   */
  confirmar() {
    this.spinner.show();
    this.service.finalizarChamado(this.validaLink).subscribe(
      resposta => {
        if (resposta.codigoRetorno == 0) {
          this.mensagemConfirmacao = "Seu chamado foi aprovado com sucesso. "
            + "Obrigado por utilizar os sistemas da DFS, você já pode fechar esta "
            + "janela ou aguarde enquanto redirecionamos você.";
          this.exibirContador = true;
          // Redireciona a pagina
          this.redirecionar();
        } else {
          this.mensagemConfirmacao = "Não foi possível executar a confirmação neste momento, por favor, tente novamente mais tarde."
        }
        this.spinner.hide();
        document.getElementById('modal').click();
      }, error => this.tratarErro(error)
    );
  }

  /*
   * Faz a reprovacao do chamado
   */
  reprovar() {
    if (this.formulario.valid) {
      this.spinner.show();
      this.validaLink.comentarioReprovacao = this.formulario.value.comentarioReprovacao;
      this.service.reprovarChamado(this.validaLink).subscribe(
        resposta => {
          if (resposta.codigoRetorno == 0) {
            this.mensagemConfirmacao = "Seu chamado foi reprovado e será avaliado pela DFS. "
              + "Obrigado por utilizar os sistemas da DFS, você já pode fechar esta "
              + "janela ou aguarde enquanto redirecionamos você.";
            this.exibirContador = true;
            // Redireciona a pagina
            this.redirecionar();
          } else {
            this.mensagemConfirmacao = "Não foi possível executar a reprovação do chamado, por favor, tente novamente mais tarde."
          }
          this.spinner.hide();
          document.getElementById('modal').click();
        }, error => this.tratarErro(error)
      );
    } else {
      this.validacaoFormulario = true;
      setTimeout(() => {
        this.validacaoFormulario = false;
      }, 2000);
    }
  }

  /*
   * Ativa o contador
   */
  redirecionar() {
    this.interval = setInterval(() => {
      this.contador = this.contador - 1;
      // Adiciona a cor vermelha
      if (this.contador == 3) {
        document.getElementById('tempoRestante').classList.add('vermelho');
      }
      // Redireciona
      if (this.contador == 0) {
        clearInterval(this.interval);
        window.location.assign("http://www.dfsdigital.com.br/");
      }
    }, 1000);
  }

  /*
   * Exibe e oculta os campos de reprovacao
   */
  exibirCamposReprocacao() {
    this.exibeReprovacao = !this.exibeReprovacao;
  }

  /*
   * Trata os erros da requisicao
   * @param erro
   */
  tratarErro(erro: any) {
    console.debug("Erro => " + erro.message);
    this.mensagemErro = true;
    this.spinner.hide();
  }

}
