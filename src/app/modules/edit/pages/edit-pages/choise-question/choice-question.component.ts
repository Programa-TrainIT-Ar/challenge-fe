import { Component, Input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  Question,
  ResponseQuestion,
} from '../../../../../shared/question-container/question-interface';

@Component({
  selector: 'app-choice-question',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './choice-question.component.html',
  styleUrl: './choice-question.component.scss',
})
export class ChoiceQuestionComponent {
  @Input() question : Question;
}
