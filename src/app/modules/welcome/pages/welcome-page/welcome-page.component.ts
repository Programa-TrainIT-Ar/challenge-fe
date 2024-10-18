import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  trigger,
  style,
  transition,
  animate,
  state,
} from '@angular/animations';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
  animations: [
    trigger('expandState1', [
      state(
        'collapsed',
        style({
          display: 'none',
        })
      ),
      state(
        'expanded',
        style({
          maxWidth: '150vh',
        })
      ),
      transition('collapsed => expanded', [animate('300ms ease-out')]),
      transition('expanded => collapsed', [animate('300ms ease-in')]),
    ]),
    trigger('expandState2', [
      state(
        'collapsed',
        style({
          width: '0px',
        })
      ),
      state(
        'expanded',
        style({
          maxWidth: '150vh',
        })
      ),
      transition('collapsed => expanded', [animate('300ms ease-out')]),
      transition('expanded => collapsed', [animate('300ms ease-in')]),
    ]),
    trigger('expandState3', [
      state(
        'collapsed',
        style({
          display: 'none',
        })
      ),
      state(
        'expanded',
        style({
          maxWidth: '150vh',
        })
      ),
      transition('collapsed => expanded', [animate('300ms ease-out')]),
      transition('expanded => collapsed', [animate('300ms ease-in')]),
    ]),
  ],
})
export class WelcomePageComponent {
  constructor(private router: Router) {}

  isExpanded1 = false; // Controla la expansión de la columna de "Todos"
  isExpanded2 = false; // Controla la expansión de la columna de "Nuevo"
  isExpanded3 = false; // Controla la expansión de la columna de "Editar"
  selectedQuiz: any = null; // Almacena el quiz seleccionado

  toggleExpand1() {
    this.isExpanded1 = !this.isExpanded1;
    this.isExpanded2 = false;
    this.isExpanded3 = false;
  }

  toggleExpand2() {
    this.isExpanded2 = !this.isExpanded2;
    this.isExpanded1 = false;
    this.isExpanded3 = false;
  }

  toggleExpand3() {
    this.isExpanded3 = !this.isExpanded3; // Cambia el estado de expansión
  }

  // Navegación existente
  goToAll() {
    this.router.navigate(['/all']);
  }

  goToCreate() {
    this.router.navigate(['/create']);
  }

  goToEdit() {
    this.router.navigate(['/edit']);
  }

  // Método para recibir el quiz seleccionado desde 'all-page'
  onQuizSelected(quiz: any) {
    this.selectedQuiz = quiz;
    this.isExpanded3 = true;  // Expande la columna de edición
    this.isExpanded1 = false;  // Colapsa la columna de "Todos"
    this.isExpanded2 = false;  // Colapsa la columna de "Nuevo"
  }

  // Método para cerrar la edición
  closeEdit() {
    this.isExpanded3 = false; // Colapsa la columna de edición
    this.selectedQuiz = null;
    this.toggleExpand1();  // Limpia el quiz seleccionado
  }
}
