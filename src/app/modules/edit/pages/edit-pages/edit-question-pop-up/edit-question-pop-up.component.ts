import { Component, EventEmitter, Input,  Output } from '@angular/core';
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
export class EditQuestionPopUpComponent {
  @Input() currentEditingQuestion: Question;
  @Input() questionToEdit: Question;
  @Input() inputType: string = '';
  @Input() selectedOption: string = '';
  @Input() isTrueFalseQuestion;
  @Input() showPlus: boolean = false;
  @Input() showInput: boolean = true;

  @Output() editedQuestion = new EventEmitter<Question>();
  @Output() cancel = new EventEmitter<void>();
  showSubmits: boolean = true;
  questionTypes: string[] = [
    'multiple_choice',
    'simple_choice',
    'true_false',
  ];

  saveChanges() {
    this.editedQuestion.emit(this.currentEditingQuestion);
  }
  closeEditPopup() {
    this.cancel.emit();
  }
  addOption() {
    this.currentEditingQuestion.options.push('Opción nueva');
  }
  private changeType(): string {
    if (this.selectedOption == 'Selección mutiple') return 'multiple_choice';
    if (this.selectedOption == 'Casilla') return 'simple_choice';
    if (this.selectedOption == 'Verdadero o falso') return 'true_false';
    return '';
  }

 answerChoice(index: number) {
   if (this.currentEditingQuestion.type === 'true_false') {
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
  changeText($event, index) {
    this.currentEditingQuestion.options[index] = $event.target.value;
  }
  onQuestionTypeChange() {

    this.currentEditingQuestion.correct_option = [];
    this.currentEditingQuestion.correct_option.push(0);
    this.currentEditingQuestion.options = [];
    this.showSubmits = true;
    const selectedType = this.currentEditingQuestion.type;
    if (selectedType === 'true_false') {
      this.currentEditingQuestion.options = ['Verdadero', 'Falso'];
      this.inputType = 'radio';
      this.isTrueFalseQuestion = true;
      this.showPlus = false;
    } else if (selectedType === 'multiple_choice') {
      this.currentEditingQuestion.options = [
        'Opción 1',
        'Opción 2',
        'Opción 3',
      ];
      this.inputType = 'checkbox';
      this.isTrueFalseQuestion = false;
      this.showPlus = true;
      this.currentEditingQuestion.correct_option.push(1);
    } else if (selectedType === 'simple_choice') {
      this.currentEditingQuestion.options = ['Opción 1', 'Opción 2'];
      this.inputType = 'radio';
      this.isTrueFalseQuestion = false;
      this.showPlus = true;
    } else {
      this.showPlus = false;
    }
  }
}

