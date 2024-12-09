import { Component, Inject, inject, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { QuestionService } from '../question-container/question.service';
import { Question } from '../question-container/question-interface';


@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss'
})
export class QuestionComponent {
  private formBuilder = inject(FormBuilder)
  
  /* private questionService = inject(QuestionService)
  ngOnInit(): void {
    this.questionService.getQuiz(id).subscribe()
  } */
  @Input() question: Question;
  @Output() answer: number[];
  
  questionForm = this.formBuilder.group({
    answer: [,[Validators.required,]]
  })
  

}
