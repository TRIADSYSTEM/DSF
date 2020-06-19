import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PaginaNaoEncontradaComponent } from './pagina-nao-encontrada/pagina-nao-encontrada.component';
import { FormularioModule } from './formulario-dinamico/formulario.module';
import { HomeComponent } from './home/home.component';
import { ChatComponent } from './chat/chat.component';
import { RelatorioModule } from './relatorio/relatorio.module';
import { ConfiguracaoModule } from './configuracao/configuracao.module';

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    FormularioModule,
    RelatorioModule,
    ConfiguracaoModule
  ],
  exports: [],
  declarations: [
    PaginaNaoEncontradaComponent,
    HomeComponent,
    ChatComponent
  ],
  providers: [],
})
export class LayoutModule { }
