import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  AbstractControl,
} from '@angular/forms';
import { QuizService } from './services/quiz.service';

@Component({
  selector: 'app-edit-pages',
  templateUrl: './edit-pages.component.html',
  styleUrls: ['./edit-pages.component.scss'],
})
export class EditPagesComponent implements OnInit {
  @Input() quizId: string;
  @Output() close = new EventEmitter<void>();

  selectNameForm: FormGroup;
  showEditForm: boolean = false;
  currentEditingQuestion: FormGroup | null = null;
  currentEditingIndex: number | null = null;
  selectedOption: string = '';
  options: string[] = [];
  questionTypes: string[] = [
    'Selección mutiple',
    'Casilla',
    'Verdadero o falso',
  ];
  showInput: boolean = true;
  inputType: string = '';
  isTrueFalseQuestion: boolean = false;
  showPlus: boolean = false;
  showSubmits: boolean = false;
  selectedValues: boolean[] = [];
  correct_option: number[] = [];
  selectedRadio: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private quizService: QuizService
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
      next: quizData => {
        console.log('Respuesta de la API:', quizData);
        this.selectNameForm.patchValue({
          name: quizData.name,
          description: quizData.description,
        });
        this.populateQuestions(quizData.questions);
      },
      error: error => {
        console.error('Error al obtener el cuestionario:', error);
      },
    });
  }

  private populateQuestions(questions: any[]) {
    const questionForms = questions.map(question => {
      const optionsArray = this.formBuilder.array(
        question.options.map((optionText: string, index: number) =>
          this.formBuilder.group({
            id: [index],
            text: [optionText],
            selected: [question.correct_option.includes(index)],
          })
        )
      );

      return this.formBuilder.group({
        id: [question.id],
        text: [question.question],
        type: [question.type],
        correct_option: [question.correct_option[0]],
        options: optionsArray,
      });
    });

    const questionsArray = this.selectNameForm.get('questions') as FormArray;
    questionsArray.clear();
    questionForms.forEach(form => questionsArray.push(form));
  }

  get questions(): FormArray {
    return this.selectNameForm.get('questions') as FormArray;
  }

  handleOptionSelection(
    questionIndex: number,
    optionIndex: number,
    event: any
  ) {
    const question = this.questions.at(questionIndex);
    const options = question.get('options') as FormArray;
    const questionType = question.get('type')?.value;

    if (questionType === 'multiple_choice') {
      const option = options.at(optionIndex);
      option.patchValue({ selected: event.target.checked });

      const selectedIndices = options.controls
        .map((opt, idx) => (opt.get('selected')?.value ? idx : null))
        .filter(idx => idx !== null);

      question.patchValue({ correct_option: selectedIndices });
    } else {
      options.controls.forEach((option, index) => {
        option.patchValue({
          selected: index === optionIndex,
        });
      });
      question.patchValue({ correct_option: optionIndex });
    }
  }

  selectCorrectOption(questionIndex: number, optionValue: string) {
    const question = this.questions.at(questionIndex);
    if (question.get('type')?.value === 'true_false') {
      const correctOption = optionValue === 'Verdadero' ? 0 : 1;
      question.patchValue({
        correct_option: correctOption,
      });
    }
  }

  createQuiz() {
    const formValue = this.selectNameForm.value;
    const updatedQuiz = {
      id: this.quizId,
      name: formValue.name,
      description: formValue.description,
      questions: formValue.questions.map(question => {
        if (question.type === 'true_false') {
          return {
            ...question,
            correct_option: [question.correct_option],
          };
        }
        return question;
      }),
    };

    this.quizService.updateQuiz(this.quizId, updatedQuiz).subscribe({
      next: response => {
        console.log('Cambios guardados para el quiz:', response);
        this.close.emit();
      },
      error: error => {
        console.error('Error al guardar cambios:', error);
      },
    });
  }

  trackByFn(index: number): number {
    return index;
  }

  showEditPopup(questionIndex: number) {
    const question = this.questions.at(questionIndex) as FormGroup;
    this.currentEditingQuestion = question;
    this.currentEditingIndex = questionIndex;
    this.showEditForm = true;

    const type = question.get('type')?.value;
    switch (type) {
      case 'multiple_choice':
        this.selectedOption = 'Selección mutiple';
        this.inputType = 'checkbox';
        break;
      case 'simple_choice':
        this.selectedOption = 'Casilla';
        this.inputType = 'radio';
        break;
      case 'true_false':
        this.selectedOption = 'Verdadero o falso';
        this.inputType = 'radio';
        break;
    }

    const optionsArray = question.get('options') as FormArray;
    this.options = optionsArray.controls.map(
      (control: AbstractControl) => control.get('text')?.value
    );

    if (type === 'true_false') {
      this.correct_option = [
        question.get('correct_option')?.value === 'Verdadero' ? 0 : 1,
      ];
    } else {
      this.correct_option = optionsArray.controls
        .map((control, index) => (control.get('selected')?.value ? index : -1))
        .filter(index => index !== -1);
    }

    this.showSubmits = true;
    this.showPlus = type !== 'true_false';
    this.isTrueFalseQuestion = type === 'true_false';
    this.changeInputType();
  }

  closeEditPopup() {
    this.showEditForm = false;
    this.currentEditingQuestion = null;
    this.currentEditingIndex = null;
    this.options = [];
    this.correct_option = [];
    this.selectedValues = [];
  }

  updateQuestion(form: any) {
    if (!this.currentEditingQuestion) return;

    const formSection = form.value;
    let questionType = '';

    switch (formSection.questionType) {
      case 'Selección mutiple':
        questionType = 'multiple_choice';
        break;
      case 'Casilla':
        questionType = 'simple_choice';
        break;
      case 'Verdadero o falso':
        questionType = 'true_false';
        break;
      default:
        console.error('Tipo de pregunta no reconocido');
        return;
    }

    this.currentEditingQuestion.patchValue({
      type: questionType,
      text: formSection.questionText,
      correct_option: this.correct_option,
    });

    const optionsArray = this.currentEditingQuestion.get(
      'options'
    ) as FormArray;
    this.selectedValues.forEach((isSelected, index) => {
      optionsArray.at(index).patchValue({ selected: isSelected });
    });

    this.closeEditPopup();
  }

  onQuestionTypeChange(selectedType: any, form: any) {
    this.correct_option = [];
    this.selectedValues = [];
    this.showSubmits = true;
    if (selectedType === 'Verdadero o falso') {
      this.options = ['Verdadero', 'Falso'];
      this.inputType = 'radio';
      this.isTrueFalseQuestion = true;
      this.showPlus = false;
    } else if (selectedType === 'Selección mutiple') {
      this.options = ['Opción 1', 'Opción 2', 'Opción 3'];
      this.inputType = 'checkbox';
      this.isTrueFalseQuestion = false;
      this.showPlus = true;
    } else if (selectedType === 'Casilla') {
      this.options = ['Opción 1', 'Opción 2'];
      this.inputType = 'radio';
      this.isTrueFalseQuestion = false;
      this.showPlus = true;
    } else {
      this.showPlus = false;
    }

    this.changeInputType();
    // this.cdr.detectChanges();
    // Implementar la lógica necesaria para el cambio de tipo de pregunta
  }

  addOption() {
    this.options.push('');
    this.selectedValues.push(false);
  }

  answerChoice(index: number) {
    if (this.inputType === 'radio') {
      this.selectedValues = this.options.map((_, i) => i === index);
      this.correct_option = [index];
    } else {
      this.selectedValues[index] = !this.selectedValues[index];
      this.correct_option = this.selectedValues
        .map((isSelected, i) => (isSelected ? i : -1))
        .filter(i => i !== -1);
    }
  }

  changeInputType() {
    this.selectedValues = Array(this.options.length).fill(false);
    this.selectedRadio = null;
    this.showInput = false;
    setTimeout(() => {
      this.showInput = true;
      // this.cdr.detectChanges();
    }, 50);
  }
}
