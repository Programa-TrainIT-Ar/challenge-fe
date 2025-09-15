import {
  Component,
  inject,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  trigger,
  style,
  transition,
  animate,
  state,
} from '@angular/animations';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
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
  @Input() isAdmin: boolean = true; //Permite adaptar la vista dependiendo del rol

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
  constructor(
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.allPageService.getAllQuiz().subscribe((response: any) => {
      if (!this.isAdmin) {
        // Si el usuario no es admin, filtra solo los quizzes activos
        this.quizzes = response.quizzes.filter((quiz: Quiz) => quiz.is_active);
      } else {
        // Si es admin, muestra todos los quizzes
        this.quizzes = response.quizzes;
      }
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
        if (!this.isAdmin) {
          // Si el usuario no es admin, filtra solo los quizzes activos
          this.quizzes = response.quizzes.filter(
            (quiz: Quiz) => quiz.is_active
          );
        } else {
          // Si es admin, muestra todos los quizzes
          this.quizzes = response.quizzes;
        }
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
    this.alertService.showConfirm(
      '¿Deseas eliminar el registro?',
      'Una vez eliminado no se podrá recuperar',
      () => {
        // Acción de confirmación
        this.allPageService.deleteQuiz(quiz.id).subscribe({
          next: () => {
            this.quizzes = this.quizzes.filter(q => q.id !== quiz.id);
            this.alertService.showSuccess(
              'Eliminado',
              'El registro ha sido eliminado.'
            );
          },
          error: () => {
            this.alertService.showError(
              'Error',
              'No se pudo eliminar el registro.'
            );
          },
        });
      },
      'Eliminar'
    );
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
