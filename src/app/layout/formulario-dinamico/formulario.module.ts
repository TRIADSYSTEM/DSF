import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule, BsLocaleService, PaginationModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgModule } from '@angular/core';

import { FormularioDetalharComponent } from './formulario-detalhar/formulario-detalhar.component';
import { FormularioListarComponent } from './formulario-listar/formulario-listar.component';
import { SanitizeHtmlPipe } from 'src/app/pipe/sanitize-html.pipe';
import { FormularioComponent } from './formulario/formulario.component';
import { ValidarComponent } from './validar/validar.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    HttpClientModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    RouterModule,
    BsDatepickerModule.forRoot(),
    PaginationModule.forRoot()
  ],
  exports: [],
  declarations: [
    FormularioListarComponent,
    FormularioDetalharComponent,
    FormularioComponent,
    ValidarComponent,
    SanitizeHtmlPipe
  ],
  providers: [
    BsLocaleService
  ],
})

export class FormularioModule { }
