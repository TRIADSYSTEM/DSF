import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PaginaNaoEncontradaComponent } from './layout/pagina-nao-encontrada/pagina-nao-encontrada.component';
import { FormularioComponent } from './layout/formulario-dinamico/formulario/formulario.component';
import { RecuperarSenhaComponent } from './recuperar-senha/recuperar-senha.component';
import { HomeComponent } from './layout/home/home.component';
import { LoginComponent } from './login/login.component';
import { ChatComponent } from './layout/chat/chat.component';
import { AuthGuard } from './guards/auth.guard';
import { ValidarComponent } from './layout/formulario-dinamico/validar/validar.component';
import { FormularioListarComponent } from './layout/formulario-dinamico/formulario-listar/formulario-listar.component';
import { FormularioDetalharComponent } from './layout/formulario-dinamico/formulario-detalhar/formulario-detalhar.component';
import { TelaPesquisaComponent } from './layout/relatorio/tela-pesquisa/tela-pesquisa.component';
import { TelaConfigComponent } from './layout/configuracao/tela-config/tela-config.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'recuperar/senha', component: RecuperarSenhaComponent },
  { path: 'recuperar/senha/:token', component: RecuperarSenhaComponent },
  { path: 'validar/:linkValidacao', component: ValidarComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'formulario/:idChamado/:idFormulario', component: FormularioComponent, canActivate: [AuthGuard] },
  { path: 'formulario/listar', component: FormularioListarComponent, canActivate: [AuthGuard] },
  { path: 'formulario/listar/detalhe/:idFormulario', component: FormularioDetalharComponent, canActivate: [AuthGuard] },
  { path: 'chat/:idChamado', component: ChatComponent, canActivate: [AuthGuard] },
  { path: 'relatorio', component: TelaPesquisaComponent, canActivate: [AuthGuard] },
  { path: 'configuracao', component: TelaConfigComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PaginaNaoEncontradaComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
