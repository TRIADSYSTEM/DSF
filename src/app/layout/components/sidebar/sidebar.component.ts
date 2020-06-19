import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AuthService } from 'src/app/login/auth.service';
import { Router, NavigationEnd } from '@angular/router';

import { ModalService } from 'src/app/shared/modal.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  //
  isActive: boolean;
  //
  collapsed: boolean;
  //
  showMenu: string;
  //
  pushRightClass: string;
  //
  @Output() collapsedEvent = new EventEmitter<boolean>();
  //
  interval: any;
  // Exibe o menu avancado
  menuAvancado: boolean = false;

  constructor(
    private authService: AuthService,
    public router: Router,
    private modalService: ModalService
  ) {
    this.router.events.subscribe(val => {
      if (
        val instanceof NavigationEnd &&
        window.innerWidth <= 992 &&
        this.isToggled()
      ) {
        this.toggleSidebar();
      }
    });
    // Menu
    this.verificaTipoMenu();
  }

  ngOnInit() {
    this.isActive = false;
    this.collapsed = false;
    this.showMenu = '';
    this.pushRightClass = 'push-right';
  }

  eventCalled() {
    this.isActive = !this.isActive;
  }

  addExpandClass(element: any) {
    if (element === this.showMenu) {
      this.showMenu = '0';
    } else {
      this.showMenu = element;
    }
  }

  toggleCollapsed() {
    this.collapsed = !this.collapsed;
    this.collapsedEvent.emit(this.collapsed);
  }

  isToggled(): boolean {
    const dom: Element = document.querySelector('body');
    return dom.classList.contains(this.pushRightClass);
  }

  toggleSidebar() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle(this.pushRightClass);
  }

  rltAndLtr() {
    const dom: any = document.querySelector('body');
    dom.classList.toggle('rtl');
  }

  /*
   * Verifica o tipo de menu
   */
  verificaTipoMenu() {
    let cdPerfil = localStorage.getItem('perfil');
    if (cdPerfil == '1') {
      this.menuAvancado = true;
    }
  }

  /*
   * Executa o logout do usuario
   */
  fazerLogout() {
    const resultado$ = this.modalService.exibirModalConfirmacao('Tem certeza que deseja realmente sair ?');
    resultado$.asObservable().subscribe(
      dados => {
        if (dados) {
          this.interval = setInterval(() => {
            clearInterval(this.interval);
            this.authService.fazerLogout();
          }, 100);
        }
      }
    );
  }

}
