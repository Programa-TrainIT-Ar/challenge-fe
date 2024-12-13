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
export class QuestionContainerComponent implements OnInit{
  @Input() test: boolean =false;
  @Output() nextStep = new EventEmitter<void>()
  counter = new Date(0);
  index: number = 0;
  question: Question | null = null;
  questions: ResponseQuestion[] = [];
  questionsTest: Question[]=[
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
  ]
 
  ngOnInit(): void {
    if (this.test) {
      this.questions = this.questionsTest.map((q, index) => ({
        id: '',
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
    } else {
      this.questionService.getQuiz('3c827617-c6df-4f96-80be-3be9f32edd0b').subscribe((response:any)=>{
        this.questions = response.questions
        if (this.questions.length > 0){
          this.updateQuestion();
        }
      })
    }
    
  }
  private questionService = inject(QuestionService)
  constructor() {
    setInterval(() => {
      this.counter = new Date(this.counter.getTime() + 1000);
    }, 1000);
  }  

  
updateQuestion(){
  if (this.questions && this.questions.length > this.index) {
    this.question = {
      questionNumber: this.index + 1,
      question: this.questions[this.index].question,
      type: this.questions[this.index].type,
      options: this.questions[this.index].options,
      correct_option: this.questions[this.index].correct_option,
    };
  this.index++;
  } else {
    if (!this.test){
      //mostrar la calificacion obtenida
    } else {
      this.nextStep.emit();
    }
}
}

}