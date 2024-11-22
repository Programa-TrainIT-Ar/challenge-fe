import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, style, transition, animate, state } from '@angular/animations';
import { Output, EventEmitter } from '@angular/core';
import Swal from 'sweetalert2';
import { environment } from '@environments/environment';
import { AllPageService } from './all-page.service'

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
  searchText: string = '';
  seniority: string = '';
  module: string = '';
  cell: string = '';
  quizzes: Quiz[] = [];
  selectedQuiz: any;
  isExpanded3: boolean = false;
  showEdit: boolean = false;

  private allPageService = inject(AllPageService)
  constructor(private router: Router) {}

  ngOnInit(): void {
    
    this.allPageService.getAllQuiz().subscribe((response:any) => {
      this.quizzes = response.quizzes
      console.log(this.quizzes)
    });
  }

  recibirDatos(quizCategory:any) {
    this.module = quizCategory.module;
    this.cell = quizCategory.cell;
    this.seniority = quizCategory.seniority;
    this.allPageService.getFilteredQuiz({
      module: this.module,
      cell: this.cell,
      seniority: this.seniority.toLowerCase(),
      search: this.searchText
    }).subscribe((response:any) => {
      this.quizzes = response.quizzes
    })
  }

  onSearchChange() {
    this.allPageService.getFilteredQuiz({
      module: this.module,
      cell: this.cell,
      seniority: this.seniority.toLowerCase(),
      search: this.searchText
    }).subscribe((response:any) => {
      this.quizzes = response.quizzes
    });
  }
 
  async toggleActive(quiz: Quiz) {
    quiz.is_active = !quiz.is_active;

    try {
      const response = await fetch(`${environment.url}/quiz/${quiz.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: quiz.is_active }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado del quiz: ' + response.status);
      }
    } catch (error) {
      console.error('Error al actualizar el estado del quiz:', error);
    }
  }

  viewQuiz(quiz: Quiz) {
    this.selectedQuiz = quiz;
    this.router.navigate(['home/view-quiz', quiz.id]);
  }

  async deleteQuiz(quiz: any) {
    try {
      const result = await Swal.fire({
        title: '¿Deseas eliminar el registro?',
        text: 'Una vez eliminado no se podrá recuperar',
        showCancelButton: true,
        confirmButtonColor: '#6c63ff',
        cancelButtonColor: '#4e4e4e',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        customClass: {
          popup: 'custom-popup',
          title: 'custom-title',
          confirmButton: 'custom-confirm-btn',
          cancelButton: 'custom-cancel-btn'
        }
      });

      if (result.isConfirmed) {
        let response = await fetch(`${environment.url}/quiz/${quiz.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        if (response.ok) {
          Swal.fire('Eliminado', 'El quiz ha sido eliminado.', 'success');
          this.quizzes = this.quizzes.filter(q => q !== quiz);
        } else {
          Swal.fire('Error', 'Hubo un error al eliminar el quiz.', 'error');
        }
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      Swal.fire('Error', 'Hubo un error en la solicitud.', 'error');
    }
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
