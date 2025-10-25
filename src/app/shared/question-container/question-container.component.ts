import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Subject, firstValueFrom } from 'rxjs';
import { Router } from '@angular/router';

import { QuestionComponent } from '../question/question.component';
import { BlueButtonComponent } from '../components/blue-button/blue-button.component';
import { QuizService } from '../../modules/quiz/pages/quiz-take/quiz-take.service';
import { Quiz, Question } from './question-interface';
import { AlertService } from '../components/alert/alert.service';
import { UserAuthService } from '../../modules/auth/user-auth.service';

@Component({
  selector: 'app-question-container',
  standalone: true,
  imports: [QuestionComponent, DatePipe, BlueButtonComponent, CommonModule],
  templateUrl: './question-container.component.html',
  styleUrl: './question-container.component.scss',
})
export class QuestionContainerComponent implements OnInit, OnDestroy {
  @Input() test: boolean = false;
  @Input() quiz!: Quiz;
  @Output() nextStep = new EventEmitter<void>();
  @Output() quizStarted = new EventEmitter<boolean>();
  @Output() showResults = new EventEmitter<any>(); 
  private destroy$ = new Subject<void>();
  private startTime?: Date;
  private currentUserId: string | null = null;

  // Estado del componente
  currentQuestionIndex = 0;
  currentQuestion: Question | null = null;
  userAnswers: Map<string, number[]> = new Map();
  counter = new Date(0);
  isSubmitting = false;
  allQuestions: Question[] = [];
  isLoading = true; // Para mostrar loading mientras verifica sesión

  // Preguntas de test
  private readonly testQuestions: Question[] = [
    {
      questionNumber: 1,
      question: '¿Cuál es la capital de Francia?',
      type: 'simple_choice',
      options: ['Londres', 'París', 'Madrid', 'Roma'],
      correct_option: [1],
    },
    {
      questionNumber: 2,
      question: 'El cielo es azul',
      type: 'true_false',
      options: ['Falso', 'Verdadero'],
      correct_option: [1],
    },
    {
      questionNumber: 3,
      question: 'Selecciona los lenguajes de programación:',
      type: 'multiple_choice',
      options: ['JavaScript', 'HTML', 'Python', 'CSS'],
      correct_option: [0, 2],
    },
  ];

  constructor(
    private quizService: QuizService,
    private router: Router,
    private alertService: AlertService,
    private userAuthService: UserAuthService
  ) {
    this.initTimer();
  }

  async ngOnInit(): Promise<void> {
    this.loadQuestions();

    if (!this.test) {
      await this.initializeUserSession();
    } else {
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ============= INICIALIZACIÓN =============

  private async initializeUserSession(): Promise<void> {
    try {
      const userId = await this.userAuthService.getCurrentUserId();

      if (!userId) {
        this.handleSessionExpired();
        return;
      }

      this.currentUserId = userId;
      this.startTime = new Date();        
      this.isLoading = false;
      this.quizStarted.emit(true);        
      
    } catch (error) {
      this.handleSessionExpired();
    }
  }

  private handleSessionExpired(): void {
    this.isLoading = false;

    this.alertService.showConfirm(
      'Sesión Requerida',
      'Necesitas iniciar sesión para realizar este quiz.',
      () => {
        this.router.navigate(['/login']);
      },
      'Ir al Login'
    );
  }

  private initTimer(): void {
    setInterval(() => {
      this.counter = new Date(this.counter.getTime() + 1000);
    }, 1000);
  }

  private loadQuestions(): void {
    this.allQuestions = this.test
      ? this.testQuestions
      : this.quiz?.questions?.map((q, i) => ({
          questionNumber: i + 1,
          question: q.question,
          type: q.type,
          options: q.options,
          correct_option: [],
        })) || [];

    this.currentQuestion = this.allQuestions[0] || null;
  }

  // ============= MANEJO DE RESPUESTAS =============

  onAnswerChanged(answer: number[]): void {
    if (!this.currentQuestion) return;

    const questionId = this.getQuestionId();
    const questionIndex = `question-${this.currentQuestionIndex}`;

    this.userAnswers.set(questionId, answer);
    this.userAnswers.set(questionIndex, answer);
  }

  private getQuestionId(): string {
    return this.test
      ? `test-${this.currentQuestionIndex}`
      : this.quiz.questions?.[this.currentQuestionIndex]?.id ||
          `question-${this.currentQuestionIndex}`;
  }

  // ============= NAVEGACIÓN =============

  nextQuestion(): void {
    if (!this.canProceed() || this.isSubmitting) return;

    this.currentQuestionIndex++;

    if (this.currentQuestionIndex >= this.allQuestions.length) {
      this.test ? this.nextStep.emit() : this.submitQuiz();
    } else {
      this.currentQuestion = this.allQuestions[this.currentQuestionIndex];
    }
  }

  canProceed(): boolean {
    if (!this.currentQuestion || this.isLoading) return false;

    const questionId = this.getQuestionId();
    const hasAnswer =
      this.userAnswers.has(questionId) &&
      (this.userAnswers.get(questionId)?.length || 0) > 0;

    return hasAnswer;
  }

  // ============= ENVÍO DEL QUIZ =============

  private async submitQuiz(): Promise<void> {
    if (this.isSubmitting || !this.currentUserId) return;

    this.isSubmitting = true;

    try {
      // Preparar datos
      const challengeData = this.prepareChallengeData(this.currentUserId);

      // Enviar al backend
      const response = await firstValueFrom(this.quizService.submitQuizAnswers(challengeData));

      console.log('✅ Quiz enviado exitosamente:', response);

      this.alertService.showConfirm(
      '¡Quiz Completado!',
      'Tu quiz ha sido enviado exitosamente. Presiona "Ver Resultados" para ver tu calificación.',
      () => {
        // Al confirmar, emitir evento para mostrar resultados
        this.showResults.emit({
          challengeResult: response, 
          quiz: this.quiz
        });
      },
      'Ver Resultados'
    );

    } catch (error) {
      this.handleSubmissionError(error);
    } finally {
      this.isSubmitting = false;
    }
  }

  private handleSubmissionError(error: any): void {
    let errorMessage = 'Ocurrió un error inesperado al enviar tu quiz.';
    let errorTitle = 'Error al Enviar Quiz';

    if (error?.status === 400) {
      errorMessage = 'Los datos del quiz no son válidos. Por favor, intenta nuevamente.';
    } else if (error?.status === 404) {
      errorMessage = 'El quiz no fue encontrado. Por favor, recarga la página.';
      errorTitle = 'Quiz No Encontrado';
    } else if (error?.status === 500) {
      errorMessage = 'Error en el servidor. Por favor, intenta más tarde.';
      errorTitle = 'Error del Servidor';
    } else if (error?.status === 401 || error?.status === 403) {
      // Sesión expirada durante el envío
      this.handleSessionExpired();
      return;
    }

    this.alertService.showError(errorMessage, errorTitle);
  }

  private prepareChallengeData(userId: string) {
    const questionAnswers: number[][] = [];

    this.quiz.questions?.forEach((question, index) => {
      const questionId = question.id;
      const userAnswer = this.userAnswers.get(questionId);
      questionAnswers.push(userAnswer || []);
    });

    const endTime = new Date();
    const timeSpentSeconds = this.startTime
      ? Math.floor((endTime.getTime() - this.startTime.getTime()) / 1000)
      : 0;

    return {
      quiz_id: this.quiz.id,
      user_id: userId,
      question_answers: questionAnswers,
      time_taken: timeSpentSeconds,
    };
  }

  // ============= MÉTODOS DE UTILIDAD =============

  getCurrentQuestionNumber(): string {
    return `${this.currentQuestionIndex + 1} de ${this.allQuestions.length}`;
  }

  getButtonText(): string {
    if (this.isLoading) return 'Cargando...';
    return this.isSubmitting
      ? 'Enviando...'
      : this.currentQuestionIndex === this.allQuestions.length - 1
      ? 'Finalizar'
      : 'Siguiente';
  }

  getCurrentQuestionTypeText(): string {
    if (!this.currentQuestion) return '';

    switch (this.currentQuestion.type) {
      case 'simple_choice':
        return 'Preguntas de selección simple.';
      case 'true_false':
        return 'Preguntas de verdadero y falso.';
      case 'multiple_choice':
        return 'Preguntas de selección múltiple.';
      default:
        return '';
    }
  }
}
