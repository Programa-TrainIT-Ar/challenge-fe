import { Component } from '@angular/core';
import {Input} from '@angular/core';
import {
  Question,
  ResponseQuestion,
} from '../../../../../shared/question-container/question-interface';

@Component({
  selector: 'app-true-false-question',
  standalone: true,
  imports: [],
  templateUrl: './true-false-question.component.html',
  styleUrl: './true-false-question.component.scss'
})
export class TrueFalseQuestionComponent {
  @Input() question : Question;
  @Input() index : any;

}
