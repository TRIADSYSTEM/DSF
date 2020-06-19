import { Injectable, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { Usuario } from './usuario';

@Injectable()
export class AuthService {

  // Indica se o usuario esta autenticado
  usuarioAutenticado: boolean = false;
  // Evento que indica se o menu deve ser exibido
  mostrarMenuEmitter = new EventEmitter<boolean>();

  constructor(
    private router: Router,
    private loginService: LoginService
  ) { }

  /*
   * Faz o login do usuario consultando a base de dados
   * @param usuario
   */
  fazerLogin(usuario: Usuario) {
    return this.loginService.fazerLogin(usuario);
  }

  /*
   * Seta os dados do usuario na sessao
   * @param dados
   */
  carregarDadosSessao(dados: Usuario) {
    // ID
    localStorage.setItem('id', dados.id + '');
    // PERFIL
    localStorage.setItem('perfil', dados.perfil + '');
    // NOME
    localStorage.setItem('nome', dados.nome);
    // LOJA
    localStorage.setItem('loja', dados.loja);
    // SENHA
    localStorage.setItem('senha', dados.senha);
    // NOME REAL
    localStorage.setItem('nomeReal', dados.nomeReal);
    // PRIMEIRO NOME
    localStorage.setItem('primeiroNome', dados.primeiroNome);
    // ENDERECO
    localStorage.setItem('endereco', dados.endereco);
    // COMPLEMENTO
    localStorage.setItem('complemento', dados.complemento);
    // CEP
    localStorage.setItem('cep', dados.cep);
    // CIDADE
    localStorage.setItem('cidade', dados.cidade);
    // ESTADO
    localStorage.setItem('estado', dados.estado);
    // CONTINENTE
    localStorage.setItem('continente', dados.continente);
    // TOKEN
    localStorage.setItem('token', dados.token);
    // TOKEN GLPI
    localStorage.setItem('session', dados.session);
    // USUARIO AUTENTICADO
    localStorage.setItem('usuarioAutenticado', this.usuarioEstaAutenticado() + '');
  }

  /*
   * Encerra a sessao do usuario
   */
  fazerLogout() {
    this.loginService.fazerLogout().subscribe();
    this.carregarDadosSessao(new Usuario());
    localStorage.setItem('usuarioAutenticado', '');
    this.usuarioAutenticado = false;
    this.mostrarMenuEmitter.emit(false);
    this.router.navigate(['/login']);
    location.reload();
  }

  /*
   * Retorna se o usuario esta ou nao autenticado
   */
  usuarioEstaAutenticado() {
    let ativo = localStorage.getItem('usuarioAutenticado');
    if (ativo != null && ativo != 'null' && ativo != '' && ativo != 'false') {
      this.usuarioAutenticado = true;
      localStorage.setItem('usuarioAutenticado', 'true');
      this.mostrarMenuEmitter.emit(true);
    }
    return this.usuarioAutenticado;
  }

}
