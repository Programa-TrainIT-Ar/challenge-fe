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
  selectCorrectOption(questionIndex: number, optionValue: string) {
    /*const question = this.questions.at(questionIndex);
    if (question.get('type')?.value === 'true_false') {
      const correctOption = optionValue === 'Verdadero' ? 0 : 1;
      question.patchValue({
        correct_option: correctOption,
      });
    }*/
  }
}
