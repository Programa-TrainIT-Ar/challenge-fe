import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { of, Subject } from 'rxjs';
import { catchError, filter, switchMap, take, takeUntil, tap } from 'rxjs/operators';

import { QuizService } from './quiz-take.service';
import { UserStateService } from 'src/app/modules/auth/user-state.service'; // AGREGADO
import { QuestionContainerComponent } from 'src/app/shared/question-container/question-container.component';
import { BlueButtonComponent } from 'src/app/shared/components/blue-button/blue-button.component';
import { SideBarComponent } from 'src/app/shared/components/sideBar/side-bar/side-bar.component';
import { Quiz } from 'src/app/shared/question-container/question-interface';
import { CanComponentDeactivate } from './unsaved-changes.guard';
import { QuizResultComponent } from '../../pages/quiz-result/quiz-result.component';

@Component({
  selector: 'app-quiz-take',
  standalone: true,
  templateUrl: './quiz-take.component.html',
  styleUrls: ['./quiz-take.component.scss'],
  imports: [
    CommonModule,
    QuestionContainerComponent,
    BlueButtonComponent,
    SideBarComponent,
    QuizResultComponent,
  ],
})
export class QuizTakeComponent
  implements OnInit, OnDestroy, CanComponentDeactivate
{
  private destroy$ = new Subject<void>();

  step = 1;
  countdown = 5;
  quiz: Quiz | null = null;
  loading = true;
  private countdownInterval?: ReturnType<typeof setInterval>;

  quizStarted = false;
  quizResults: any = null;
  isAlreadyCompleted = false; // flag para saber si ya estaba completado

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService,
    private userStateService: UserStateService // AGREGADO
  ) {}

  ngOnInit(): void {
    const quizId = this.route.snapshot.paramMap.get('id');
    if (quizId) {
      this.loadQuiz(quizId);
    } else {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private loadQuiz(quizId: string): void {
    // 1. Obtener el ID del usuario de forma reactiva y ejecutar el flujo
    this.userStateService.unifiedUser$
      .pipe(
        // Filtrar para asegurar que el objeto 'user' tenga un 'id' válido.
        filter(user => !!(user?.sub || user?.id)), 
        take(1),
        switchMap(user => {
          const userId = user?.sub || user?.id || null;
          console.log("User en quiz:", userId);
          
          if (!userId) {
            console.error('No se pudo obtener el ID del usuario');
            this.loading = false;
            // Retornar un Observable vacío para detener el flujo.
            return of(null);
          }

          // 2. Carga del Quiz (Lógica original envuelta)
          return this.quizService.getQuizById(quizId).pipe(
            tap(quiz => {
              this.quiz = quiz; // Asignar quiz (Lógica original)
              // 3. Llamar a la función checkExistingChallenge modificada con el userId
              this.checkExistingChallenge(quizId, userId);
            }),
            // Manejar error de carga del quiz
            catchError(error => {
              console.error('Error loading quiz:', error);
              this.router.navigate(['/']);
              return of(null);
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(); // La suscripción solo inicia el flujo, el estado final se maneja en checkExistingChallenge.
  }

  private checkExistingChallenge(
    quizId: string,
    userId: string
  ): void {
    // La validación de userId se realizó en loadQuiz, pero se mantiene la verificación de seguridad
    if (!userId) {
      this.loading = false;
      return;
    }

    console.log('🔍 Verificando challenge existente para usuario:', userId);

    this.quizService
      .checkExistingChallenge(userId, quizId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: result => {
          console.log('📋 Resultado verificación:', result);

          if (result.already_completed) {
            //  Mapear datos para el componente de resultado
            this.quizResults = {
              id: result.id,
              calification: result.calification,
              time_taken: result.time_taken,
              created_at: result.created_at,
            };

            this.isAlreadyCompleted = true; // AGREGADO
            this.step = 5; // Ir directamente a mostrar resultados

            console.log(
              '✅ Challenge ya completado, mostrando resultados:',
              this.quizResults
            );
          } else {
            console.log('🆕 Challenge no completado, permitir realizarlo');
          }

          this.loading = false;
        },
        error: error => {
          console.error('❌ Error verificando challenge:', error);
          this.loading = false; // Permitir continuar en caso de error
        },
      });
  }

  nextStep(): void {
    if (this.step < 5) {
      this.step++;
      if (this.step === 3) {
        this.startCountdown();
      }
    } else if (this.step === 5) {
      this.router.navigate(['/dashboard']);
    }
  }

  private startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
        }
        this.nextStep();
      }
    }, 1000);
  }

  @HostListener('window:beforeunload', ['$event'])
  canDeactivate(): boolean {
    return !this.quizStarted;
  }

  onQuizStarted(isStarted: boolean): void {
    this.quizStarted = isStarted;
  }

  onShowResults(resultsData: any): void {
    this.quizStarted = false;
    this.quizResults = resultsData.challengeResult;
    this.isAlreadyCompleted = false; // Es un resultado nuevo
    console.log('📊 Mostrando resultados nuevos:', this.quizResults);
    this.step = 5;
  }
}
