import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

import { Usuario } from './usuario';
import { AuthService } from './auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  // Objeto com os dados do usuario
  usuario: Usuario;
  // Utilizado para conrolar a exibicao da mensagem de validacao
  exibirMsgValidacao: boolean = false;
  // Armazena a mensagem de validacao que sera exibida.
  mensagemValidacao: string;
  // Cria um formulario para os dados do login
  formulario: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService
  ) { }

  ngOnInit() {
    // Verifica se o usuário ja não esta logado
    if (localStorage.getItem('token') != '') {
      this.router.navigate(['/home']);
    }
    this.usuario = new Usuario();
    this.carregarFormulario();
  }

  /*
   * Carrega os dados do formulario
   */
  carregarFormulario() {
    this.formulario = this.fb.group({
      usuario: [null, [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      senha: [null, [Validators.required]]
    });
  }

  /*
   * Exibe o campo com destaque quando ocorre um erro
   * @param field
   */
  hasError(field: string) {
    let campo = this.formulario.get(field).value;
    if (campo == '' || campo == null) {
      document.getElementById(field).classList.add('is-invalid');
    } else {
      document.getElementById(field).classList.remove('is-invalid');
    }
  }

  /*
   * Faz o login do usuario no sistema
   */
  fazerLogin() {
    if (this.formulario.valid) {
      this.spinner.show();
      this.usuario.nome = this.formulario.get('usuario').value;
      this.usuario.senha = this.formulario.get('senha').value;
      this.authService.fazerLogin(this.usuario).subscribe(
        dados => {
          if (dados != null) {
            // Monta os dados da sessao
            this.authService.carregarDadosSessao(dados);
            // Faz a navegacao para a home
            if (dados.token != '' && dados.token != null) {
              this.authService.usuarioAutenticado = true;
              localStorage.setItem('usuarioAutenticado', 'true');
              this.authService.mostrarMenuEmitter.emit(true);
              this.router.navigate(['/']);
            } else {
              this.mensagemValidacao = 'Usuário/Senha inválido(s).';
              this.limparCampos();
              document.getElementById('btnModalValidacao').click();
              this.authService.usuarioAutenticado = false;
              this.authService.mostrarMenuEmitter.emit(false);
            }
            this.spinner.hide();
          }
        }, error => {
          console.log(error.mensagem);
          this.spinner.hide();
          this.mensagemValidacao = 'Desculpe, não foi possível validar seu login, por favor, tente novamente mais tarde.';
          document.getElementById('btnModalValidacao').click();
          this.authService.usuarioAutenticado = false;
        }
      );
    }
  }

  /**
   * Valida se oo campos usuário e senha foram preenchidos
   */
  validarCamposPreenchidos() {
    if (this.usuario.nome == '' || this.usuario.senha == '') {
      this.mensagemValidacao = 'Os campos de usuário e senha devem ser preenchidos.';
      return false;
    } else {
      return true;
    }
  }

  /**
   * Limpa os campos do usuário
   */
  limparCampos() {
    this.formulario.reset();
  }

  recuperarSenha() {
    this.router.navigate(['recuperar/senha']);
  }

}
