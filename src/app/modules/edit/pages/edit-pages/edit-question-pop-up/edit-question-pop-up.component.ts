import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {   FormsModule } from '@angular/forms';
import { CommonModule   } from '@angular/common';
import { Question } from '../../../../../shared/question-container/question-interface';
import { TypeOptionsPipe } from '../type-options.pipe';

@Component({
  selector: 'app-edit-question-pop-up',
  standalone: true,
  imports: [FormsModule, CommonModule, TypeOptionsPipe],
  templateUrl: './edit-question-pop-up.component.html',
  styleUrl: './edit-question-pop-up.component.scss',

})
export class EditQuestionPopUpComponent implements OnInit {
  @Input() questionToEdit: Question;
  @Input() showInput: boolean = true;
  @Output() editedQuestion = new EventEmitter<Question>();
  @Output() cancel = new EventEmitter<void>();
  isTrueFalseQuestion : boolean = true;
  currentEditingQuestion: Question;
  showPlus: boolean = false;
  showSubmits: boolean = true;
  questionTypes: string[] = [
    'multiple_choice',
    'simple_choice',
    'true_false',
  ];

  ngOnInit() {
    this.currentEditingQuestion = structuredClone(this.questionToEdit);
    this.isTrueFalseQuestion = this.isTrueFalseQuestionMethod();
    this.showPlus = !this.isTrueFalseQuestionMethod();
  }
  saveChanges() {
    this.deleteEmptyOptions();
    this.editedQuestion.emit(this.currentEditingQuestion);
  }

  addOption() {
    if(this.currentEditingQuestion.options.length < 6){
      this.currentEditingQuestion.options.push('Opción nueva');
    }else{
      alert('El límite son 6 opciones.');
    }
  }
  changeQuestionAnswer(index: number) {
    if (this.isTrueFalseQuestionMethod()) {
      this.currentEditingQuestion.correct_option = [index];
    } else {
      const idx = this.currentEditingQuestion.correct_option.indexOf(index);
      if (idx > -1) {
        this.currentEditingQuestion.correct_option.splice(idx, 1);
      } else {
        this.currentEditingQuestion.correct_option.push(index);
      }
    }
  }

  changeQuestionText($event, index) {
    this.currentEditingQuestion.options[index] = $event.target.value;
  }

  changeQuestionType() {
    this.currentEditingQuestion.correct_option = [];
    this.currentEditingQuestion.correct_option.push(0);
    this.currentEditingQuestion.options = [];
    this.showSubmits = true;
    const selectedType = this.currentEditingQuestion.type;
    if (selectedType === 'true_false') {
      this.setTypeToTrueFalse();
    } else if (selectedType === 'multiple_choice') {
     this.setTypeToMultipleChoice();
    } else if (selectedType === 'simple_choice') {
     this.setTypeToSimpleChoice();
    }
  }

  private setTypeToTrueFalse() {
    this.currentEditingQuestion.options = ['Verdadero', 'Falso'];
    this.isTrueFalseQuestion = true;
    this.showPlus = false;
  }

  private setTypeToMultipleChoice() {
    this.currentEditingQuestion.options = [
      'Opción 1',
      'Opción 2',
      'Opción 3',
    ];
    this.isTrueFalseQuestion = false;
    this.showPlus = true;
    this.currentEditingQuestion.correct_option.push(1);
  }

  private setTypeToSimpleChoice() {
    this.currentEditingQuestion.options = ['Opción 1', 'Opción 2'];
    this.isTrueFalseQuestion = false;
    this.showPlus = true;
  }

  private deleteEmptyOptions() {
    this.currentEditingQuestion.options = this.currentEditingQuestion.options.filter(option => option.trim() !== '');
  }

  private isTrueFalseQuestionMethod(): boolean{
    return !this.currentEditingQuestion.type.includes('choice');
  }
}


