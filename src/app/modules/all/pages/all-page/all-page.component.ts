import { Component, inject, input, OnInit, output } from '@angular/core';
import { Router } from '@angular/router';
import {
  trigger,
  style,
  transition,
  animate,
  state,
} from '@angular/animations';
import { Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { environment } from '@environments/environment';
import { AllPageService } from './all-page.service';

interface User {
  first_name: string;
}

interface Module {
  name: string;
}

interface Cell {
  name: string;
}

interface Seniority {
  name: string;
}

interface Quiz {
  id: string;
  name: string;
  seniority: Seniority;
  created_at: string;
  created_by: User;
  module: Module;
  cell: Cell;
  is_active: boolean;
}

@Component({
  selector: 'app-all-page',
  templateUrl: './all-page.component.html',
  styleUrls: ['./all-page.component.scss'],
  animations: [
    trigger('expandState3', [
      state('collapsed', style({ display: 'none' })),
      state('expanded', style({ maxWidth: '150vh' })),
      transition('collapsed => expanded', [animate('300ms ease-out')]),
      transition('expanded => collapsed', [animate('300ms ease-in')]),
    ]),
  ],
})
export class AllPageComponent implements OnInit {
  @Output() quizSelected = new EventEmitter<any>();

  module: string = '';
  cell: string = '';
  seniority: string = '';
  searchText: string = '';
  selectedQuizOnView: Quiz | null = null;

  quizzes: Quiz[] = [];
  selectedQuiz: any;
  isExpanded3: boolean = false;
  showEdit: boolean = false;

  private allPageService = inject(AllPageService);
  constructor(private router: Router) {}

  ngOnInit(): void {
    this.allPageService.getAllQuiz().subscribe((response: any) => {
      this.quizzes = response.quizzes;
    });
  }

  recibirDatos(quizCategory: any) {
    this.module = quizCategory.module;
    this.cell = quizCategory.cell;
    this.seniority = quizCategory.seniority;
    this.onSearchChange();
  }

  onSearchChange() {
    this.allPageService
      .getFilteredQuiz({
        module: this.module,
        cell: this.cell,
        seniority: this.seniority.toLowerCase(),
        search: this.searchText,
      })
      .subscribe((response: any) => {
        this.quizzes = response.quizzes;
      });
  }

  toggleActive(quiz: Quiz) {
    quiz.is_active = !quiz.is_active;
    this.allPageService.toggleIsActiveQuiz(quiz.id, quiz.is_active).subscribe({
      next: response => {
        console.log('Se actualizo el estado del quiz correctamente', response);
      },
      error: error => {
        console.error('Error al actualizar el estado del quiz:', error);
      },
    });
  }

  viewQuiz(quiz: Quiz) {
    this.selectedQuizOnView = quiz; // Esto hace que la ventana emergente se muestre
  }
  closeQuiz() {
    this.selectedQuizOnView = null; // Esto hace que la ventana emergente se cierre
  }

  deleteQuiz(quiz: Quiz) {
    Swal.fire({
      title: '¿Deseas eliminar el registro?',
      text: 'Una vez eliminado no se podrá recuperar',
      showCloseButton: true,
      showCancelButton: false,
      confirmButtonText: 'Eliminar',
      customClass: {
        popup: 'custom-delete-popup',
        title: 'custom-delete-title',
        confirmButton: 'custom-delete-confirm-button',
      },
    }).then(result => {
      if (result.isConfirmed) {
        this.allPageService.deleteQuiz(quiz.id).subscribe({
          next: () => {
            this.quizzes = this.quizzes.filter(q => q.id !== quiz.id);
            Swal.fire({
              title: 'Eliminado',
              text: 'El registro ha sido eliminado.',
              icon: 'success',
              confirmButtonText: 'Entendido',
              customClass: {
                popup: 'custom-delete-popup',
                title: 'custom-delete-title',
                confirmButton: 'custom-delete-confirm-button',
              },
            });
          },
          error: () => {
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el registro.',
              icon: 'error',
              confirmButtonText: 'Entendido',
              customClass: {
                popup: 'custom-delete-popup',
                title: 'custom-delete-title',
                confirmButton: 'custom-delete-confirm-button',
              },
            });
          },
        });
      }
    });
  }

  editQuiz(quiz: Quiz) {
    this.selectedQuiz = quiz;
    this.quizSelected.emit(quiz);
  }

  closeEdit() {
    this.selectedQuiz = null;
    this.isExpanded3 = false;
  }
}
