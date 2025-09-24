import { Component, EventEmitter, Output,Input } from '@angular/core';
import {
  Question,
} from '../../../../../shared/question-container/question-interface';
import { ChoiceQuestionComponent } from '../choise-question/choice-question.component';
import { TrueFalseQuestionComponent } from '../true-false-question/true-false-question.component';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [
    ChoiceQuestionComponent,
    TrueFalseQuestionComponent,
  ],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss',
})
export class QuestionComponent {
  @Input() question: Question;
  @Input() index: number;
  @Output() edit = new EventEmitter<number>();
}
