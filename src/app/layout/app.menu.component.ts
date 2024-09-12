import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.model = [
      {
        label: 'Home',
        items: [
          // {
          //   label: 'Dashboard',
          //   icon: 'pi pi-fw pi-home',
          //   routerLink: ['/dashboard'], 
          // },
          {
            label: 'Candidatos',
            icon: 'fa-solid fa-users',
            routerLink: ['/candidatos'], 
          },
          {
            label: 'Configurar Challenge',
            icon: 'fa-solid fa-share-nodes',
            routerLink: ['/challenge'], 
          },
          {
            label: 'Calificar Challenge',
            icon: 'fa-solid fa-graduation-cap',
            routerLink: ['/challenge-rating'], 
          },
        ],
      },
    ];
  }
}
