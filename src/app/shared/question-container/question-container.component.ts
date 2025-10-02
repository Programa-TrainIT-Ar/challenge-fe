import { Component, EventEmitter, inject, Input, OnInit, Output, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { QuestionComponent } from '../question/question.component';
import { BlueButtonComponent } from '../components/blue-button/blue-button.component';
import { QuizService } from '../../modules/quiz/pages/quiz-take/quiz-take.service';
import { Quiz, Question } from './question-interface';
import { QuizAnswer, QuizSubmission } from 'src/app/modules/quiz/quiz.interface';

@Component({
  selector: 'app-question-container',
  standalone: true,
  imports: [QuestionComponent, DatePipe, BlueButtonComponent, CommonModule],
  templateUrl: './question-container.component.html',
  styleUrl: './question-container.component.scss'
})
export class QuestionContainerComponent implements OnInit, OnDestroy {
  @Input() test: boolean = false;
  @Input() quiz!: Quiz;
  @Output() nextStep = new EventEmitter<void>();
  @Output() quizStarted = new EventEmitter<boolean>();
  @Output() quizCompleted = new EventEmitter<boolean>();
  private destroy$ = new Subject<void>();

  currentQuestionIndex = 0;
  currentQuestion: Question | null = null;
  userAnswers: Map<string, number[]> = new Map();
  counter = new Date(0);
  isSubmitting = false;

  // AGREGADO - array para manejar todas las preguntas
  allQuestions: Question[] = [];

  private readonly testQuestions: Question[] = [
    { questionNumber: 1, question: '¿Cuál es la capital de Francia?', type: 'simple_choice', options: ['Londres', 'París', 'Madrid', 'Roma'], correct_option: [1] },
    { questionNumber: 2, question: 'El cielo es azul', type: 'true_false', options: ['Falso', 'Verdadero'], correct_option: [1] },
    { questionNumber: 3, question: 'Selecciona los lenguajes de programación:', type: 'multiple_choice', options: ['JavaScript', 'HTML', 'Python', 'CSS'], correct_option: [0, 2] },
  ];

  // AGREGADO - para medir tiempo
  private startTime?: Date;

  constructor(private quizService: QuizService) {
    setInterval(() => {
      this.counter = new Date(this.counter.getTime() + 1000);
    }, 1000);
  }

  ngOnInit(): void {
    this.loadQuestions();
    // AGREGADO - iniciar medición de tiempo solo para quiz real
    if (!this.test) {
      this.startTime = new Date();
      console.log('Quiz iniciado a las:', this.startTime.toLocaleTimeString());
      this.quizStarted.emit(true);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadQuestions(): void {
    // SIMPLIFICADO - cargar todas las preguntas de una vez
    this.allQuestions = this.test ? this.testQuestions :
      this.quiz?.questions?.map((q, i) => ({ questionNumber: i + 1, question: q.question, type: q.type, options: q.options, correct_option: [] })) || [];

    this.currentQuestion = this.allQuestions[0] || null;
  }

  onAnswerChanged(answer: number[]): void {
    if (!this.currentQuestion) return;

    // CORREGIDO - obtener ID de forma segura
    const questionId = this.test ? `test-${this.currentQuestionIndex}` :
      (this.quiz.questions?.[this.currentQuestionIndex]?.id || `question-${this.currentQuestionIndex}`);

    this.userAnswers.set(questionId, answer);

    // AGREGADO - Console log como solicitaste
    console.log('Question ID:', questionId, 'Selected answers:', answer);
  }

  nextQuestion(): void {
    // AGREGADO - validación simple
    if (!this.canProceed() || this.isSubmitting) return;

    this.currentQuestionIndex++;

    // SIMPLIFICADO - lógica única para ambos casos
    if (this.currentQuestionIndex >= this.allQuestions.length) {
      this.test ? this.nextStep.emit() : this.submitQuiz();
    } else {
      this.currentQuestion = this.allQuestions[this.currentQuestionIndex];
    }
  }

  private submitQuiz(): void {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const answers: QuizAnswer[] = Array.from(this.userAnswers.entries()).map(([questionId, selectedOptions]) => ({
      question_id: questionId,
      selected_options: selectedOptions
    }));

    // AGREGADO - calcular tiempo y timestamps
    const endTime = new Date();
    const timeSpentSeconds = this.startTime ?
      Math.floor((endTime.getTime() - this.startTime.getTime()) / 1000) : 0;

    console.log('Quiz terminado a las:', endTime.toLocaleTimeString());
    console.log('Tiempo total:', timeSpentSeconds, 'segundos');

    const submission = {
      quiz_id: this.quiz.id,
      answers,
      started_at: this.startTime?.toISOString(), // AGREGADO - cuándo comenzó
      completed_at: endTime.toISOString(), // AGREGADO - cuándo terminó
      time_spent_seconds: timeSpentSeconds // AGREGADO - tiempo total
    };

    console.log('Submitting quiz:', submission);
    // Aquí irías al servicio cuando esté listo
  }

  canProceed(): boolean {
    if (!this.currentQuestion) return false;

    const questionId = this.test ? `test-${this.currentQuestionIndex}` :
      (this.quiz.questions?.[this.currentQuestionIndex]?.id || `question-${this.currentQuestionIndex}`);

    return this.userAnswers.has(questionId) && (this.userAnswers.get(questionId)?.length || 0) > 0;
  }

  getCurrentQuestionNumber(): string {
    return `${this.currentQuestionIndex + 1} de ${this.allQuestions.length}`;
  }

  // AGREGADO - texto dinámico del botón (mínimo)
  getButtonText(): string {
    return this.isSubmitting ? 'Enviando...' :
           this.currentQuestionIndex === this.allQuestions.length - 1 ? 'Finalizar' : 'Siguiente';
  }
}
