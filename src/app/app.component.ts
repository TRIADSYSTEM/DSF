import { Component } from '@angular/core';
import { AuthService } from './login/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Sistema de Chamados - Field Service';

  mostrarMenu: boolean = false;

  collapedSideBar: boolean;

  urlToJson = 'assets/configuracoes/aplication_configuration.json';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Controla o menu
    this.authService.mostrarMenuEmitter.subscribe(
      (mostrar: boolean) => this.mostrarMenu = mostrar
    );
  }

  receiveCollapsed($event: any) {
    this.collapedSideBar = $event;
  }

}
