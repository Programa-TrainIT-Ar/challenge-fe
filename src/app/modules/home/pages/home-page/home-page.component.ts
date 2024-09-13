import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss'
})
export class HomePageComponent {
  user: string = 'Agustín';  // Aquí puedes cambiar dinámicamente el nombre del usuario

  activeSection = 'Todos';  // Sección activa por defecto

  setActiveSection(section: string) {
    this.activeSection = section;
  }
}
