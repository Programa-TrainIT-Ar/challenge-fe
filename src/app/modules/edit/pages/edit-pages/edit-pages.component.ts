import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import {
  trigger,
  style,
  transition,
  animate,
  state,
} from '@angular/animations';
import { QuizService } from './services/quiz.service';

@Component({
  selector: 'app-edit-pages',
  templateUrl: './edit-pages.component.html',
  styleUrls: ['./edit-pages.component.scss'],
  animations: [
    trigger('enterState', [
      state('void', style({ transform: 'translateX(-50%)' })),
      transition(':enter', [
        animate(300, style({ transform: 'translateX(0)' })),
      ]),
    ]),
  ],
})
export class EditPagesComponent implements OnInit, OnChanges {
  @Input() quizId: string;
  @Output() close = new EventEmitter<void>();

  isEditing: boolean = false;
  selectNameForm: FormGroup;
  currentPage: number = 0;
  questionsPerPage: number = 3;

  constructor(
    private formBuilder: FormBuilder,
    private quizService: QuizService
  ) {
    this.selectNameForm = this.formBuilder.group({
      name: [''],
      questions: this.formBuilder.array([]),
    });
  }

  ngOnInit() {
    if (this.quizId) {
      this.loadQuiz();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['quizId'] && changes['quizId'].currentValue) {
      this.loadQuiz();
    }
  }

  private loadQuiz() {
    if (!this.quizId) {
      console.error('Quiz ID no proporcionado');
      return;
    }

    this.quizService.getQuizWithQuestions(this.quizId).subscribe(
      quizData => {
        console.log('Respuesta de la API:', quizData);
        this.selectNameForm.patchValue({ name: quizData.name });
        this.populateQuestions(quizData.questions);
      },
      error => {
        console.error('Error al obtener el cuestionario:', error);
      }
    );
  }

  private populateQuestions(questions: any[]) {
    console.log('Preguntas recibidas:', questions);

    const questionForms = questions.map(question =>
      this.formBuilder.group({
        id: [question.id],
        text: [question.question],
        type: [question.type],
        correct_option: [question.correct_option[0]], // Ajuste aquí
        options: this.formBuilder.array(
          question.options.map((optionText, index) => 
            this.formBuilder.group({
              id: [index.toString()], // Usar el índice como ID
              text: [optionText], // Asignar el texto directamente
              selected: [index === question.correct_option[0]], // Marcar la opción correcta
            })
          )
        ),
      })
    );

    const questionsArray = this.selectNameForm.get('questions') as FormArray;
    questionsArray.clear();
    questionForms.forEach(form => questionsArray.push(form));

    console.log('Preguntas pobladas:', this.questions.value);
  }

  get questions(): FormArray {
    return this.selectNameForm.get('questions') as FormArray;
  }

  get paginatedQuestions() {
    const startIndex = this.currentPage * this.questionsPerPage;
    return this.questions.controls.slice(
      startIndex,
      startIndex + this.questionsPerPage
    );
  }

  get totalPages() {
    return Math.ceil(this.questions.length / this.questionsPerPage);
  }

  createQuiz() {
    const updatedQuiz = {
      id: this.quizId,
      name: this.selectNameForm.value.name,
      questions: this.questions.value,
    };

    this.quizService.updateQuiz(this.quizId, updatedQuiz).subscribe(
      response => {
        console.log('Cambios guardados para el quiz:', response);
        this.close.emit();
      },
      error => {
        console.error('Error al guardar cambios:', error);
      }
    );
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
    }
  }

  // Método para seleccionar la opción correcta
  selectCorrectOption(questionIndex: number, optionId: string) {
    const question = this.questions.at(questionIndex);
    const options = question.get('options') as FormArray;

    // Limpiar la selección previa
    options.controls.forEach(option => {
      option.get('selected').setValue(false);
    });

    // Marcar la opción seleccionada
    const selectedOption = options.controls.find(
      option => option.get('id').value === optionId
    );
    if (selectedOption) {
      selectedOption.get('selected').setValue(true);
      question.get('correct_option').setValue(optionId);
    }
  }
}
