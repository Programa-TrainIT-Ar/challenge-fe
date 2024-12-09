import { Component, inject, OnInit } from '@angular/core';
import { QuestionComponent } from '../question/question.component';
import { DatePipe } from '@angular/common';
import { QuestionService } from './question.service';
import { Question, ResponseQuestion } from './question-interface';
import { BlueButtonComponent } from '../components/blue-button/blue-button.component';

@Component({
  selector: 'app-question-container',
  standalone: true,
  imports: [QuestionComponent, DatePipe, BlueButtonComponent],
  templateUrl: './question-container.component.html',
  styleUrl: './question-container.component.scss'
})
export class QuestionContainerComponent implements OnInit{
  counter = new Date(0);
  index: number = 0;
  questions: ResponseQuestion[]=[];
  question: Question | null = null;
  private questionService = inject(QuestionService)
  constructor() {
    setInterval(() => {
      this.counter = new Date(this.counter.getTime() + 1000);
    }, 1000);
  }

ngOnInit(): void {
  this.questionService.getQuiz('3c827617-c6df-4f96-80be-3be9f32edd0b').subscribe((response:any)=>{
    this.questions = response.questions
    if (this.questions.length > 0){
      this.updateQuestion();
    }
  })
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
  }
}
}