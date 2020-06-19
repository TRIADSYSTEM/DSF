import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDatepickerModule, TooltipModule  } from 'ngx-bootstrap';

import { TelaPesquisaComponent } from './tela-pesquisa/tela-pesquisa.component';

@NgModule({
  declarations: [TelaPesquisaComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    TooltipModule.forRoot()
  ]
})
export class RelatorioModule { }
