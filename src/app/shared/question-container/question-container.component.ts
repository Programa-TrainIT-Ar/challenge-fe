import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { QuestionComponent } from '../question/question.component';
import { CommonModule, DatePipe } from '@angular/common';
import { QuestionService } from './question.service';
import { Question, ResponseQuestion } from './question-interface';
import { BlueButtonComponent } from '../components/blue-button/blue-button.component';

@Component({
  selector: 'app-question-container',
  standalone: true,
  imports: [QuestionComponent, DatePipe, BlueButtonComponent, CommonModule],
  templateUrl: './question-container.component.html',
  styleUrl: './question-container.component.scss'
})
export class QuestionContainerComponent implements OnInit {
  @Input() test: boolean = false;
  @Input() quiz: any = null; // Recibe el quiz desde el padre
  @Input() quizId: string = ''; // Recibe el quizId
  @Output() nextStep = new EventEmitter<void>();

  counter = new Date(0);
  index: number = 0;
  question: Question | null = null;
  questions: any[] = []; // Cambiado para usar los datos reales
  userAnswers: any[] = []; // Para guardar las respuestas del usuario

  questionsTest: Question[] = [
    {
      questionNumber: 1,
      question: 'Pregunta',
      type: 'true_false',
      options: ['falso', 'verdadero'],
      correct_option: [],
    },
    {
      questionNumber: 2,
      question: 'Pregunta',
      type: 'simple_choice',
      options: ['Opcion 1', 'Opcion 2', 'Opcion 3'],
      correct_option: [],
    },
    {
      questionNumber: 3,
      question: 'Pregunta',
      type: 'multiple_choice',
      options: ['Opcion 1', 'Opcion 2', 'Opcion 3', 'Opcion 4'],
      correct_option: [],
    },
  ];

  private questionService = inject(QuestionService);

  constructor() {
    setInterval(() => {
      this.counter = new Date(this.counter.getTime() + 1000);
    }, 1000);
  }

  ngOnInit(): void {
    console.log('QuestionContainer - test:', this.test);
    console.log('QuestionContainer - quiz:', this.quiz);
    
    if (this.test) {
      this.loadTestQuestions();
    } else {
      this.loadRealQuiz();
    }
  }

  private loadTestQuestions() {
    this.questions = this.questionsTest.map((q, index) => ({
      id: `test-${index}`,
      question: q.question,
      seniority: 'test',
      type: q.type,
      options: q.options,
      correct_option: q.correct_option,
      explanation: '',
      link: '',
      is_active: true,
      created_at: new Date(),
      updated_at: new Date(),
      quiz_id: 'test-quiz'
    }));
    this.updateQuestion();
  }

  private loadRealQuiz() {
    // USAR LOS DATOS DEL QUIZ PASADOS COMO INPUT
    if (this.quiz && this.quiz.questions && this.quiz.questions.length > 0) {
      console.log('Loading real quiz questions:', this.quiz.questions);
      this.questions = this.quiz.questions;
      this.userAnswers = new Array(this.questions.length).fill(null);
      this.updateQuestion();
    } else {
      console.error('No quiz data or questions provided', this.quiz);
    }
  }

  updateQuestion() {
    if (this.questions && this.questions.length > this.index) {
      // Crear la pregunta usando los datos reales del backend
      this.question = {
        questionNumber: this.index + 1,
        question: this.questions[this.index].question,
        type: this.questions[this.index].type,
        options: this.questions[this.index].options,
        correct_option: [] // No mostrar respuestas correctas
      };
      
      console.log('Current question:', this.question);
      this.index++;
    } else {
      if (!this.test) {
        console.log('Quiz completed! Answers:', this.userAnswers);
        this.submitQuiz();
      } else {
        this.nextStep.emit();
      }
    }
  }

  // Método para recibir respuesta seleccionada
  onAnswerSelected(answer: any) {
    const currentQuestionIndex = this.index - 1;
    if (currentQuestionIndex >= 0 && currentQuestionIndex < this.questions.length) {
      this.userAnswers[currentQuestionIndex] = {
        questionId: this.questions[currentQuestionIndex].id,
        selectedOptions: Array.isArray(answer) ? answer : [answer]
      };
      console.log('Answer selected:', this.userAnswers[currentQuestionIndex]);
    }
  }

  private submitQuiz() {
    // Filtrar respuestas válidas (que no sean null)
    const validAnswers = this.userAnswers.filter(answer => answer !== null);
    
    console.log('Submitting quiz with answers:', validAnswers);
    
    // Aquí puedes implementar el envío al backend
    // this.questionService.submitQuiz(this.quizId, validAnswers).subscribe(...)
    
    // Por ahora solo mostrar en consola
    alert(`Quiz completado! ${validAnswers.length} respuestas registradas.`);
  }

  // Método para verificar si todas las preguntas están respondidas
  isQuizComplete(): boolean {
    return this.userAnswers.every(answer => answer !== null);
  }
}
