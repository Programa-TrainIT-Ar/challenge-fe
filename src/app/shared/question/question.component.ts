import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Question } from '../question-container/question-interface';


@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss'
})

export class QuestionComponent implements OnInit, OnChanges {
  @Input() question!: Question;
  @Output() answerChanged = new EventEmitter<number[]>();

  questionForm!: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['question'] && !changes['question'].firstChange) {
      this.initForm();
    }
  }

  private initForm(): void {
    this.questionForm = this.formBuilder.group({
      answer: [[], Validators.required]
    });

    this.questionForm.get('answer')?.valueChanges.subscribe(value => {
      this.emitAnswer(value);
    });
  }

  onOptionChange(optionIndex: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    const currentValue = this.questionForm.get('answer')?.value || [];

    if (this.question.type === 'multiple_choice') {
      let newValue = [...currentValue];
      if (target.checked) {
        if (!newValue.includes(optionIndex)) {
          newValue.push(optionIndex);
        }
      } else {
        newValue = newValue.filter(val => val !== optionIndex);
      }
      this.questionForm.patchValue({ answer: newValue });
    } else {
      // Para simple_choice y true_false
      this.questionForm.patchValue({ answer: [optionIndex] });
    }
  }

  private emitAnswer(value: number[]): void {
    this.answerChanged.emit(Array.isArray(value) ? value : [value]);
  }

  isOptionSelected(optionIndex: number): boolean {
    const currentValues = this.questionForm.get('answer')?.value || [];
    return currentValues.includes(optionIndex);
  }
}
