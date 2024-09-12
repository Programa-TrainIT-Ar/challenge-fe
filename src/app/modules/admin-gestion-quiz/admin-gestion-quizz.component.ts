


import { Component, OnInit } from '@angular/core';


@Component({
 selector: 'app-admin-gestion-quizz',
  standalone: true,
  imports: [],
  templateUrl: './admin-gestion-quizz.component.html',
  styleUrl: './admin-gestion-quizz.component.scss'
})
export class AdminGestionQuizzComponent {
  user: string = 'Agustín';  // Aquí puedes cambiar dinámicamente el nombre del usuario

  activeSection = 'Todos';  // Sección activa por defecto

  setActiveSection(section: string) {
    this.activeSection = section;
  }
}