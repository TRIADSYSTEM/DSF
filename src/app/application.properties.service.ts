import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApplicationPropertiesService {

  urlServe: string = "http://localhost:8080/dfsfieldservicedesk/service/";

  constructor() {}

  /**
   * Retorna a URL da requisicao.
   */
  urlRequisicao() {
    return this.urlServe;
  }

}
