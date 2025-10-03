import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { QuizService } from './services/quiz.service';
import {
  Question,
  ResponseQuestion,
  UpdateQuizRequest,
} from '../../../../shared/question-container/question-interface';
import {Quiz} from '../../../../shared/question-container/question-interface';

@Component({
    selector: 'app-edit-pages',
    templateUrl: './edit-pages.component.html',
    styleUrls: ['./edit-pages.component.scss'],
})
export class EditPagesComponent implements OnInit {
    private quizService = inject(QuizService);
    private formBuilder = inject(FormBuilder);
    @Input() quizId: string;
    @Output() close = new EventEmitter<void>();
    quiz : Quiz={} as Quiz;
    questionsData: Question[] = [];
    currentEditingQuestion: null| Question = null;
    currentEditingIndex: number | null = null;
    selectNameForm: FormGroup;
    showEditForm: boolean = false;
    selectedOption: string = '';
    options: string[] = [];
    inputType: string = '';
    showPlus: boolean = false;
    showSubmits: boolean = false;
    selectedValues: boolean[] = [];
    correct_option: number[] = [];
    initialQuizCategory: any = null;
    cell_id: string = '';
    seniority: string = '';

    constructor(
    ) {
        this.selectNameForm = this.formBuilder.group({
      name: [''],
      description: [''],
      questions: this.formBuilder.array([]),
    });
  }

  ngOnInit() {
    if (this.quizId) {
      this.loadQuiz();
    }
  }

  private loadQuiz() {
    if (!this.quizId) {
      console.error('Quiz ID no proporcionado');
      return;
    }

    this.quizService.getQuizWithQuestions(this.quizId).subscribe({
      next: (quizData : Quiz) => {
        this.selectNameForm.patchValue({
          name: quizData.name,
          description: quizData.description,
        });

        this.initialQuizCategory = {
          module: quizData.cell.module.name,
          module_id: quizData.cell.module.id,
          cell: quizData.cell.name,
          cell_id: quizData.cell.id,
          seniority: quizData.seniority
        };

        console.log('Modulo inicial:', this.initialQuizCategory);
        this.quiz = quizData;

        quizData.questions.forEach((data,index) => this.questionsData.push(this.ToQuestion(data,index)));
      },
      error: error => {
        console.error('Error al obtener el cuestionario:', error);
      },
    });
  }





  get questions(): FormArray {
    return this.selectNameForm.get('questions') as FormArray;
  }


  receiveCategory(quizCategory: any) {
    this.initialQuizCategory.module = quizCategory.module;
    this.initialQuizCategory.module_id = quizCategory.moduleId;
    this.cell_id = quizCategory.cellId;
    this.seniority = quizCategory.seniority;
    this.initialQuizCategory.cell_id = quizCategory.cellId;
    this.initialQuizCategory.seniority = quizCategory.seniority;
  }
  createQuiz() {
    this.quizService.updateQuiz(this.quizId, this.toUpdateQuizRequest()).subscribe({
      next: response => {
        console.log('Cambios guardados para el quiz:', response);
        this.close.emit();
      },
      error: error => {
        console.error('Error al guardar cambios:', error);
      },
    });
  }

  private ToQuestion(data: ResponseQuestion, questionNumber : number): Question {
    return {
      id: data.id,
      correct_option: data.correct_option,
      options: data.options,
      question: data.question,
      questionNumber: questionNumber,
      type: data.type,
      seniority: this.quiz.seniority,
    }
  }
  private toUpdateQuizRequest(): UpdateQuizRequest{
    return {
      cell_id: this.quiz.cell_id,
      challenge_type: this.quiz.challenge_type,
      created_by_id: this.quiz.created_by_id,
      description: this.quiz.description,
      is_active: this.quiz.is_active,
      max_time: this.quiz.max_time,
      name: this.quiz.name,
      questions: this.questionsData,
      seniority: this.quiz.seniority,

    }
  }
  showEditPopup(questionIndex: number) {
    this.currentEditingQuestion = this.questionsData[questionIndex];
    this.currentEditingIndex = questionIndex;
    this.showEditForm = true;
    this.showSubmits = true;
  }

  closeEditPopup() {
    this.showEditForm = false;
    this.currentEditingQuestion = null;
    this.currentEditingIndex = null;
    this.options = [];
    this.correct_option = [];
    this.selectedValues = [];
  }

  onEditHandler(question: Question) {
    this.questionsData[question.questionNumber]= question;
    this.closeEditPopup();
  }

}
