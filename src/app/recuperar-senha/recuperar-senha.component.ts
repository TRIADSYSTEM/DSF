import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RecuperarSenhaService } from './recuperar-senha-service';
import { RecuperarSenha } from './recuperar-senha';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.scss']
})
export class RecuperarSenhaComponent implements OnInit {

  // E-mail informado pelo usuário
  email: string;
  // Armazena a mensagem de validacao que sera exibida.
  mensagemValidacao: string;
  // Verifica se o e=mail informado e valido
  emailValido: boolean = false;
  // Token de recuperacao de senha
  tokenRecuperarSenha: string;
  // Exibe o formulario para recuperar a senha
  formularioRecuperarSenha: boolean = false;
  // Nova senha
  novaSenha: string = '';
  // Confirmacao da senha
  confirmacaoNovaSenha: string = '';
  // Link expirado
  linkValido: boolean = true;
  // Exibir mensagem senha aletrada com sucesso
  senhaAlteradaSucesso: boolean = false;

  dadosRecuperarSenha: RecuperarSenha;

  constructor(
    private router: Router,
    private recuperarSenhaService: RecuperarSenhaService,
    private spinner: NgxSpinnerService
  ) { }


  ngOnInit() {
    // Pega os dados da URL
    let url = (this.router.routerState.snapshot.url).replace("/recuperar/senha", "");
    if (url != '') {
      url = url.replace("/", "");
      this.spinner.show();
      this.formularioRecuperarSenha = true;
      this.recuperarSenhaService.validarToken(url).subscribe(
        dados => {
          this.linkValido = dados.dataValida;
          this.dadosRecuperarSenha = dados;
          this.spinner.hide();
        }, error => {
          this.spinner.hide();
          this.linkValido = false;
          this.mensagemValidacao = 'Erro ao validar o link.';
          document.getElementById('btnModalValidacao').click();
        }
      );
    } else {
      this.email = '';
    }
  }

  /**
   * Envia o e-mail de recupeacao para o usuario
   */
  recuperarSenha() {
    if (this.validaEmailPreenchido() && this.emailValido) {
      this.spinner.show();
      this.recuperarSenhaService.recuperarSenha(this.email).subscribe(
        dados => {
          if (dados.usuarioExiste == false || dados.sucessoOperacao == false) {
            this.mensagemValidacao = "Desculpe, não foi possível enviar o e-mail, por favor, entre em contato com a DFS.";
          } else {
            this.mensagemValidacao = "E-mail de recuperação enviado.";
          }
          document.getElementById('btnModalValidacao').click();
          this.spinner.hide();
        }, error => {
          this.spinner.hide();
          this.mensagemValidacao = 'Erro ao tentar consultar o e-mail.';
          document.getElementById('btnModalValidacao').click();
        }
      );
    } else {
      document.getElementById('btnModalValidacao').click();
    }
  }

  /**
   * Valida o e-mail informado
   * @param event
   */
  validarEmail(event: any) {
    this.mensagemValidacao = "O e-mail informado não é valido.";
    this.emailValido = event.target.validity.valid && (this.email.indexOf(".") != -1);
  }

  /**
   * Verifica se os campos obrigatorios foram preenchidos
   */
  validaEmailPreenchido() {
    if (this.email == '') {
      this.mensagemValidacao = "O campo e-mail deve ser informado.";
      return false;
    }
    return true;
  }

  /**
   * Redireciona para a pagina de login
   */
  carregarLogin() {
    this.router.navigate(['login']);
  }

  /**
   * Faz a alteracao da senha
   */
  alterarSenha() {
    if (this.novaSenha != '' && this.confirmacaoNovaSenha != '') {
      if (this.verificarSenhasIguais()) {
        this.spinner.show();
        this.dadosRecuperarSenha.novaSenha = this.novaSenha;
        this.recuperarSenhaService.alterarSenha(this.dadosRecuperarSenha).subscribe(
          dados => {
            this.spinner.hide();
            this.senhaAlteradaSucesso = true;
          }, error => {
            this.spinner.hide();
            this.senhaAlteradaSucesso = false;
            this.mensagemValidacao = 'Erro ao alterar a senha. Favor contatar o suporte do DFS.';
            document.getElementById('btnModalValidacao').click();
          }
        );
      } else {
        this.mensagemValidacao = "As senhas informadas não são iguais.";
        document.getElementById('btnModalValidacao').click();
      }
    } else {
      this.mensagemValidacao = "Os dois campos da senha devem ser informados.";
      document.getElementById('btnModalValidacao').click();
    }
  }

  /**
   * Verifica se as senhas digitadas sao iguais
   */
  verificarSenhasIguais() {
    return this.novaSenha === this.confirmacaoNovaSenha;
  }

}
