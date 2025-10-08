import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Subject, Observable, firstValueFrom } from 'rxjs';
import { takeUntil, filter, switchMap } from 'rxjs/operators';
import { AuthService, User } from '@auth0/auth0-angular';

import { QuestionComponent } from '../question/question.component';
import { BlueButtonComponent } from '../components/blue-button/blue-button.component';
import { QuizService } from '../../modules/quiz/pages/quiz-take/quiz-take.service';
import { Quiz, Question } from './question-interface';
import { UserService } from '../../modules/auth/pages/user.service';

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
    private auth: AuthService,
    private userService: UserService
  ) {
    this.initTimer();
  }

  ngOnInit(): void {
    this.loadQuestions();
    this.loadCurrentUser();
    
    if (!this.test) {
      this.startTime = new Date();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ============= INICIALIZACIÓN =============

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

  private async loadCurrentUser(): Promise<void> {
    try {
      // Obtener usuario de Auth0
      const authUser = await firstValueFrom(
        this.auth.user$.pipe(
          filter(user => !!user && !!user.email),
          takeUntil(this.destroy$)
        )
      );

      if (!authUser?.email) {
        return;
      }

      // Buscar usuario en la base de datos
      const dbUserResponse = await firstValueFrom(
        this.userService.finduserByEmail(authUser.email).pipe(takeUntil(this.destroy$))
      );

      if (!dbUserResponse || !dbUserResponse.user || !dbUserResponse.user.id) {
        console.error('❌ Usuario no encontrado en la base de datos');
        return;
      }

      // Ahora sí acceder correctamente al ID
      this.currentUserId = dbUserResponse.user.id;
      
    } catch (error) {
      console.error('❌ Error cargando usuario:', error);
    }
  }

  // ============= MANEJO DE RESPUESTAS =============

  onAnswerChanged(answer: number[]): void {
    if (!this.currentQuestion) return;

    // Guardar respuesta usando tanto el ID como el índice para mayor compatibilidad
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
    if (!this.currentQuestion) return false;

    const questionId = this.getQuestionId();
    const hasAnswer = this.userAnswers.has(questionId) && 
                     (this.userAnswers.get(questionId)?.length || 0) > 0;
    
    return hasAnswer;
  }

  // ============= ENVÍO DEL QUIZ =============

  private async submitQuiz(): Promise<void> {
    if (this.isSubmitting) return;
    
    this.isSubmitting = true;

    try {
      if (!this.currentUserId) {
        throw new Error('Usuario no autenticado. No se puede enviar el quiz.');
      }

      // Preparar datos
      const challengeData = this.prepareChallengeData(this.currentUserId);
      
      // envio al backend
      const response = await firstValueFrom(
        this.quizService.submitQuizAnswers(challengeData)
      );

      // Avanzar a la pagina de resultados
      this.nextStep.emit();

    } catch (error) {
      console.error('❌ Error enviando challenge:', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  private prepareChallengeData(userId: string) {
    const questionAnswers: number[][] = [];

    // Crear array de respuestas en el orden correcto
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
