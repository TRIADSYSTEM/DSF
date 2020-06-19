import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AppComponent } from './app.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgModule } from '@angular/core';

import { RecuperarSenhaComponent } from './recuperar-senha/recuperar-senha.component';
import { SidebarComponent } from './layout/components/sidebar/sidebar.component';
import { HeaderComponent } from './layout/components/header/header.component';
import { LoginComponent } from './login/login.component';
import { Interceptor } from './guards/auth.interceptor';
import { LayoutModule } from './layout/layout.module';
import { SharedModule } from './shared/shared.module';
import { AuthService } from './login/auth.service';
import { AuthGuard } from './guards/auth.guard';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    SidebarComponent,
    RecuperarSenhaComponent
  ],
  imports: [
    ReactiveFormsModule,
    NgxSpinnerModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    Interceptor,
    LayoutModule,
    SharedModule,
    ModalModule.forRoot(),
  ],
  providers: [
    AuthService,
    AuthGuard
  ],
  bootstrap: [
    AppComponent
  ]
})

export class AppModule { }
