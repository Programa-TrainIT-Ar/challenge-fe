import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
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
  currentPage: number = 0;
  questionsPerPage: number = 2; // Aumentado a 5 preguntas por página
  maxVisiblePages: number = 5; // Número máximo de páginas visibles en la paginación

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

  private loadQuiz() {
    if (!this.quizId) {
      console.error('Quiz ID no proporcionado');
      return;
    }

    this.quizService.getQuizWithQuestions(this.quizId).subscribe({
      next: (quizData) => {
        console.log('Respuesta de la API:', quizData);
        this.selectNameForm.patchValue({ name: quizData.name });
        this.populateQuestions(quizData.questions);
      },
      error: (error) => {
        console.error('Error al obtener el cuestionario:', error);
      }
    });
  }

  private populateQuestions(questions: any[]) {
    const questionForms = questions.map(question => {
      if (question.type === 'true_false') {
        const correctAnswer = question.correct_option[0] === 0 ? 'Verdadero' : 'Falso';
        return this.formBuilder.group({
          id: [question.id],
          text: [question.question],
          type: [question.type],
          correct_option: [correctAnswer],
          options: this.formBuilder.array([]),
        });
      } else {
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
          correct_option: [question.correct_option],
          options: optionsArray,
        });
      }
    });

    const questionsArray = this.selectNameForm.get('questions') as FormArray;
    questionsArray.clear();
    questionForms.forEach(form => questionsArray.push(form));
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

  get visiblePages(): number[] {
    const totalPages = this.totalPages;
    const current = this.currentPage;
    const maxVisible = this.maxVisiblePages;
    
    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    let start = Math.max(0, current - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages - 1, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(0, end - maxVisible + 1);
    }

    return Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );
  }

  get showFirstPage(): boolean {
    return this.visiblePages[0] > 0;
  }

  get showLastPage(): boolean {
    return this.visiblePages[this.visiblePages.length - 1] < this.totalPages - 1;
  }

  handleOptionSelection(questionIndex: number, optionIndex: number, event: any) {
    const question = this.questions.at(questionIndex);
    const options = question.get('options') as FormArray;
    const questionType = question.get('type').value;

    if (questionType === 'multiple_choice') {
      const option = options.at(optionIndex);
      option.patchValue({ selected: event.target.checked });

      const selectedIndices = options.controls
        .map((opt, idx) => (opt.get('selected').value ? idx : null))
        .filter(idx => idx !== null);

      question.patchValue({ correct_option: selectedIndices });
    } else {
      options.controls.forEach((option, index) => {
        option.patchValue({
          selected: index === optionIndex,
        });
      });
      question.patchValue({ correct_option: [optionIndex] });
    }
  }

  selectCorrectOption(questionIndex: number, optionValue: string) {
    const question = this.questions.at(questionIndex);
    if (question.get('type').value === 'true_false') {
      question.patchValue({
        correct_option: optionValue,
      });
    }
  }

  createQuiz() {
    const formValue = this.selectNameForm.value;
    const updatedQuiz = {
      id: this.quizId,
      name: formValue.name,
      questions: formValue.questions.map(question => {
        if (question.type === 'true_false') {
          const correctOptionNumber = question.correct_option === 'Verdadero' ? 0 : 1;
          return {
            ...question,
            correct_option: [correctOptionNumber],
          };
        }
        return {
          ...question,
          correct_option: question.correct_option,
        };
      }),
    };

    this.quizService.updateQuiz(this.quizId, updatedQuiz).subscribe({
      next: (response) => {
        console.log('Cambios guardados para el quiz:', response);
        this.close.emit();
      },
      error: (error) => {
        console.error('Error al guardar cambios:', error);
      }
    });
  }

  goToPage(page: number) {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
    }
  }

  nextPage() {
    this.goToPage(this.currentPage + 1);
  }

  prevPage() {
    this.goToPage(this.currentPage - 1);
  }

  trackByFn(index: number): number {
    return index;
  }
}