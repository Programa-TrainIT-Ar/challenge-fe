import {
  Component,
  inject,
  Input,
  OnInit,
  Output,
  EventEmitter,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  trigger,
  style,
  transition,
  animate,
  state,
} from '@angular/animations';
import { AlertService } from 'src/app/shared/components/alert/alert.service';
import { AllPageService } from './all-page.service';
import { UserAuthService } from 'src/app/modules/auth/user-auth.service'; // AGREGADO
import { firstValueFrom } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';



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
  isCompleted?: boolean; // AGREGADO
  challengeResult?: any; // AGREGADO
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
  @Input() isAdmin: boolean = true;
  @Output() quizSelected = new EventEmitter<any>();

  module: string = '';
  cell: string = '';
  seniority: string = '';
  searchText: string = '';
  selectedQuizOnView: Quiz | null = null;
  isLoading: boolean = false;

  quizzes: Quiz[] = [];
  selectedQuiz: any;
  isExpanded3: boolean = false;
  showEdit: boolean = false;

  //  para manejar usuario actual
  currentUserId: string | null = null;

  private allPageService = inject(AllPageService);

  constructor(
    private router: Router,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private userAuthService: UserAuthService,
    private loader: LoaderService
  ) {}

  async ngOnInit(): Promise<void> {
    //  Obtener userId si no es admin
    if (!this.isAdmin) {
      try {
        this.currentUserId = await this.userAuthService.getCurrentUserId();
      } catch (error) {
        console.error('Error obteniendo userId:', error);
      }
    }

    this.route.queryParams.subscribe(params => {
      this.module = params['module'] || '';
      this.cell = params['cell'] || '';
      this.seniority = params['seniority'] || '';
      this.searchText = params['search'] || '';
      this.onSearchChange();
    });
  }

  recibirDatos(quizCategory: any) {
    this.module = quizCategory.module;
    this.cell = quizCategory.cell;
    this.seniority = quizCategory.seniority;
    this.onSearchChange();
  }

  // Verificar challenges completados después de cargar quizzes
  async onSearchChange() {
    this.loader.show(); // Mostrar loader al iniciar la carga de datos
    try{
      const response: any = await firstValueFrom(this.allPageService
      .getFilteredQuiz({
        module: this.module,
        cell: this.cell,
        seniority: this.seniority.toLowerCase(),
        search: this.searchText, 
      })
    );
        if (!this.isAdmin) {
          this.quizzes = response.quizzes.filter((quiz: Quiz) => quiz.is_active);

          // Verificar cuáles están completados si hay userId
          if (this.currentUserId) {
            await this.checkCompletedChallenges();
          }
        } else {
          this.quizzes = response.quizzes;
        }
       } catch (err) {
        console.error('Error al cargar quizzes:', err);
      } finally {
        console.log('🔹 Ocultando loader'); 
        this.loader.hide(); // Ocultar loader al finalizar la carga de datos
      }
    }

  // Verificar challenges completados
  private async checkCompletedChallenges(): Promise<void> {
    if (!this.currentUserId) return;

    for (const quiz of this.quizzes) {
      try {
        const result = await this.allPageService.checkCompletedChallenge(this.currentUserId, quiz.id).toPromise();

        if (result.already_completed) {
          quiz.isCompleted = true;
          quiz.challengeResult = {
            id: result.id,
            calification: result.calification,
            time_taken: result.time_taken,
            created_at: result.created_at,
            quiz_name: quiz.name,
            total_questions: result.total_questions
          };
        } else {
          quiz.isCompleted = false;
        }
      } catch (error) {
        console.error(`Error verificando quiz ${quiz.id}:`, error);
        quiz.isCompleted = false;
      }
    }
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

  //  Manejar tanto "Realizar" como "Ver Resultado"
  takeQuiz(quiz: Quiz) {
    if (quiz.isCompleted && quiz.challengeResult) {
      this.showChallengeResult(quiz.challengeResult);
    } else {
      this.router.navigate(['/quiz', quiz.id]);
    }
  }

  //  Mostrar resultado usando AlertService
  private showChallengeResult(result: any) {
    const timeInMinutes = Math.floor(result.time_taken / 60);
    const timeInSeconds = result.time_taken % 60;
    const timeFormatted = `${timeInMinutes.toString().padStart(2, '0')}:${timeInSeconds.toString().padStart(2, '0')}`;

    const resultMessage = `Challenge: ${result.quiz_name}

    Puntaje: ${result.calification} / ${result.total_questions}
    Tiempo: ${timeFormatted}
    Completado: ${new Date(result.created_at).toLocaleDateString('es-ES')}`;

    this.alertService.showConfirm(
      'Resultado del Challenge',
      resultMessage,
      () => {}, // Función vacía ya que solo queremos mostrar info
      'Cerrar'
    );
  }

  // Obtener texto del botón dinámicamente
  getButtonText(quiz: Quiz): string {
    return quiz.isCompleted ? 'Ver' : 'Realizar';
  }

  // Obtener clase CSS del botón
  getButtonClass(quiz: Quiz): string {
    return quiz.isCompleted ? 'status Inactivo' : 'status Activo';
  }

  viewQuiz(quiz: Quiz) {
    this.selectedQuizOnView = quiz;
  }

  closeQuiz() {
    this.selectedQuizOnView = null;
  }

  deleteQuiz(quiz: Quiz) {
    this.alertService.showConfirm(
      '¿Deseas eliminar el registro?',
      'Una vez eliminado no se podrá recuperar',
      () => {
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
