import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { trigger, style, transition, animate, state } from '@angular/animations';
import { QuizService } from './services/quiz.service';

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
export class EditPagesComponent implements OnInit {
  @Input() quizId: string; // Cambia esto para recibir solo el ID del quiz
  @Output() close = new EventEmitter<void>();

  isEditing: boolean = false;
  selectNameForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private quizService: QuizService) {
    this.selectNameForm = this.formBuilder.group({
      name: [''],
      questions: this.formBuilder.array([]) 
    });
  }

  ngOnInit() {
    // Obtener el cuestionario y sus preguntas al iniciar
    if (!this.quizId) {
      console.error('Quiz ID no proporcionado');
      return; // Salir si no hay ID
    }
  
    this.quizService.getQuizWithQuestions(this.quizId).subscribe(quizData => {
      this.selectNameForm.patchValue({ name: quizData.name });
      this.populateQuestions(quizData.questions);
      console.log(quizData)
    }, error => {
      console.error('Error al obtener el cuestionario:', error);
    });

  }

  private populateQuestions(questions: any[]) {
    const questionForms = questions.map(question => this.formBuilder.group({
      id: [question.id],
      text: [question.text],
      type: [question.type],
      correct_option: [question.correct_option],
      options: this.formBuilder.array(question.options.map(option => this.formBuilder.group({
        id: [option.id],
        text: [option.text],
        selected: [option.selected || false]
      })))
    }));

    const questionsArray = this.selectNameForm.get('questions') as FormArray;
    questionsArray.clear(); 
    questionForms.forEach(form => questionsArray.push(form));
  }

  get questions(): FormArray {
    return this.selectNameForm.get('questions') as FormArray;
  }

  createQuiz() {
    const updatedQuiz = {
      id: this.quizId,
      name: this.selectNameForm.value.name,
      questions: this.questions.value,
    };

    this.quizService.updateQuiz(this.quizId, updatedQuiz).subscribe(response => {
      console.log('Cambios guardados para el quiz:', response);
      this.close.emit(); 
    }, error => {
      console.error('Error al guardar cambios:', error);
    });
  }
  editQuestion(index: number) {
    
    const question = this.questions.at(index);
    
    console.log('Editando pregunta:', question.value);
  }
}
