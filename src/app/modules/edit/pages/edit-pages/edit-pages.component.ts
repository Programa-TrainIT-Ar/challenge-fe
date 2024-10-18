import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { trigger, style, transition, animate, state } from '@angular/animations';

@Component({
  selector: 'app-edit-pages',
  templateUrl: './edit-pages.component.html',
  styleUrls: ['./edit-pages.component.scss'],
  animations: [
    trigger('enterState', [
      state('void', style({
        transform: 'translateX(-50%)',
      })),
      transition(':enter', [
        animate(300, style({
          transform: 'translateX(0)'
        }))
      ])
    ])
  ]
})
export class EditPagesComponent {
  @Input() quiz: { name: string; questions: any[]; modulo: any; celula: any; seniority: any };
  @Output() close = new EventEmitter<void>();

  isEditing:boolean = false;
  selectNameForm: FormGroup;
  questionCategory: any;
  showButton = false;
  constructor(private formBuilder: FormBuilder) {
    this.selectNameForm = this.formBuilder.group({
      name: ['']
    });
  }

  ngOnInit() {
    // this.selectNameForm.patchValue({
    //   name: this.quiz.name,
    // });

    this.populateQuestions(this.quiz.questions);
    this.questionCategory = { 
      modulo: this.quiz.modulo || '',
      celula: this.quiz.celula || '',
      seniority: this.quiz.seniority || ''
    };
  }

  private populateQuestions(questions: any[]) {
    this.questionCategory.questions = this.formBuilder.array(questions.map(question => {
      return this.formBuilder.group({
        text: [question.text],
        type: [question.type],
        options: this.formBuilder.array(question.options.map(option => this.formBuilder.group({
          text: [option.text],
          selected: [option.selected || false]
        })))
      });
    }));
  }

  get questions(): FormArray {
    return this.questionCategory.questions as FormArray;
  }

  createQuiz() {
    const updatedQuiz = {
      ...this.quiz,
      name: this.selectNameForm.value.name,
      questions: this.questions.value,
      modulo: this.questionCategory.modulo,
      celula: this.questionCategory.celula,
      seniority: this.questionCategory.seniority,
    };

    console.log('Cambios guardados para el quiz:', updatedQuiz);
    this.close.emit(); // Emitir evento para cerrar
  }

  recibirDatos(event: any) {
    console.log('Datos recibidos:', event);
  }
}
