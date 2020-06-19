import { Injectable, NgModule } from '@angular/core';

import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, timeout } from 'rxjs/operators';

import { AuthService } from '../login/auth.service';
import { ModalService } from '../shared/modal.service';

@Injectable()
export class HttpsRequestInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private modalService: ModalService
  ) { }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const dupReq = req.clone({
      headers: req.headers.set('token', localStorage.getItem('token')),
    });
    return next.handle(dupReq).pipe(
      timeout(120000),
      tap(() => { },
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status !== 401) {
              return;
            }
            this.fazerLogout();
          }
        }
      )
    );
  }

  /*
   * Exibe a mensagem para o usuario e redireciona para o logout
   */
  fazerLogout() {
    const resultado$ = this.modalService.exibirModalSessao('Sua sessão expirou e foi encerrada para garantir a sua segurança, por favor, faça o login novamente.');
    resultado$.asObservable().subscribe(
      dados => {
        if (dados) {
          this.authService.fazerLogout();
        }
      }
    );
  }

}

@NgModule({
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpsRequestInterceptor,
      multi: true,
    },
  ],
})


export class Interceptor { }
