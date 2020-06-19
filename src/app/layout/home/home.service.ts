import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { take } from 'rxjs/operators';

import { Resposta } from '../resposta';
import { ApplicationPropertiesService } from 'src/app/application.properties.service';
import { Agenda } from './agenda';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  // Link para carregar a agenda
  urlAgendaNaoConfirmada: string = this.urlRequisicao.urlRequisicao() + 'agenda/agendaNaoConfirmada';

  // Link para carregar a agenda
  urlAgendaConfirmada: string = this.urlRequisicao.urlRequisicao() + 'agenda/agendaConfirmada';

  // Link para carregar a agenda
  urlConfirmarAgendamento: string = this.urlRequisicao.urlRequisicao() + 'agenda/confirmarAgendamento';

  // Link para carregar a agenda
  urlReagendarAgendamento: string = this.urlRequisicao.urlRequisicao() + 'agenda/reagendarAgendamento';

  constructor(
    private http: HttpClient,
    private urlRequisicao: ApplicationPropertiesService
  ) { }


  /*
   * Carrega os dados dos agendamentos nao confirmados
   * @param userId
   */
  carregarAgendaNaoConfirmada(userId: any) {
    return this.http.get<Array<Agenda>>(`${this.urlAgendaNaoConfirmada}/${userId}`).pipe(take(1));
  }

  /*
   * Carrega os dados dos agendamentos confirmados
   */
  carregarAgendaConfirmada(userId: any) {
    return this.http.get<Array<Agenda>>(`${this.urlAgendaConfirmada}/${userId}`).pipe(take(1));
  }

  /*
   * Confirma o agendamento
   * @param ticketId
   * @param userId
   */
  confirmarAgendamento(ticketId: any, userId: any) {
    return this.http.get<Resposta>(`${this.urlConfirmarAgendamento}/${ticketId}/${userId}`).pipe(take(1));
  }

  /*
   * Cancela o agendamento
   */
  reagendarAgendamento(ticketId: any) {
    const formdata: FormData = new FormData();
    formdata.append('ticketId', ticketId);
    formdata.append('userId', localStorage.getItem('id'));
    return this.http.post(this.urlReagendarAgendamento, formdata, { observe: 'response' }).pipe(take(1));
  }

}
