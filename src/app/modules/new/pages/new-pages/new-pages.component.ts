import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { ChangeDetectorRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { NewPageService } from './new-pages.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';

@Component({
  selector: 'app-new-pages',
  templateUrl: './new-pages.component.html',
  styleUrls: ['./new-pages.component.scss'],
})
export class NewPagesComponent {
  constructor(
    private formsBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
    private newPageService: NewPageService,
    private alertService: AlertService,
  ) {}

  public selectNameForm = this.formsBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    module: ['', [Validators.required]],
    cell: ['', [Validators.required]],
    seniority: ['', [Validators.required]],
  });

  questionTypes: string[] = [
    'Selección mutiple',
    'Casilla',
    'Verdadero o falso',
  ];

  questionCategory: any = {
    module: 'Selecciona la célula',
    seniority: 'Seniority',
  };

  quizData = {
      name: '',
      description: '',
      module: '',
      cell_id: '',
      seniority: '',
      challenge_type: '',
      created_by_id: '',
      is_active: true,
    };

  questionText: string = '';
  questions: any[] = [];
  options: string[] = [];
  selection: number[] = [];
  selectedOption: string = '';
  inputType: string = '';
  showButton: boolean = true;
  pop: boolean = false;
  showForm: boolean = false;
  isTrueFalseQuestion: boolean = false;
  showPlus: boolean = false;
  showSubmits: boolean = false;
  quizID: string = '';
  createOrEdit: boolean = true;
  toggle: boolean = true;
  isFocused: boolean = false;
  correct_option: number[] = [];
  selectedValues: boolean[] = [];
  inputsValues: boolean = false;
  temporaryQuestions: any[] = [];
  
  showInput: boolean = true;
  selectedRadio: string | null = null;

  recibirDatos(datos: any) {
    this.selectNameForm.get('module').setValue(datos.module);
    this.selectNameForm.get('cell').setValue(datos.cell);
    this.selectNameForm.get('seniority').setValue(datos.seniority);
    this.quizData.module= datos.moduleId,
    this.quizData.cell_id= datos.cellId,
    this.quizData.seniority= datos.seniority.toLowerCase()
  }
  
  isFieldInvalid(field: string): boolean {
    const control = this.selectNameForm.get(field);
    return control.invalid && (control.dirty || control.touched);
  }

  isValidInput() {
    return this.selectNameForm.valid
  }
  
  async createQuiz() {
    // Conseguir el User_id del usuario autenticado
    try {  
      const user = await firstValueFrom(this.auth.user$);    
      if (!user?.email) {
        throw new Error('No se encontró el email del usuario autenticado');
      }
      
      this.newPageService.findUserByEmail(user.email).subscribe({
        next: (response: any)=>{
          this.quizData.created_by_id = response.id;
        },
        error: (error)=>{
          console.error('Error al obtener el usuario desde el backend')
        }
      })

      // Mostrar el formulario para agregar preguntas
      this.showButton = false;
      this.showForm = true;
      this.toggle = false;
      this.showButton = false;

      // Guardar los datos del quiz para usarlos cuando tengamos todas las preguntas
      this.quizData.name= this.selectNameForm.value.name;
      this.quizData.challenge_type= 'immediate',
      this.quizData.description= this.selectNameForm.value.description;
    } 
    catch (error) {
      console.error('Error preparando el quiz:', error);
      this.alertService.showError(error.message || 'Error al preparar el quiz');
      this.showButton = false;
    }
  }
  
  trackByFn(index: number): any {
    return index;
  }

  closeFn() {
    this.pop = false;
  }

  answerChoice(i: number) {
    if (this.correct_option.includes(i)) {
      this.correct_option = this.correct_option.filter(
        element => element !== i
      );
    } else {
      this.correct_option.push(i);
    }
  }

  answerChoiceRadio(i: number) {
    // Para radio buttons, simplemente estableces la opción seleccionada
    this.correct_option = [i]; 
}
  changeInputType() {
    this.selectedValues = Array(this.options.length).fill(false);
    this.selectedRadio = null;
    this.showInput = false;
    setTimeout(() => {
      this.showInput = true;
      this.cdr.detectChanges();
    }, 50);
  }

  onQuestionTypeChange(selectedType: string, form: any) {
    this.correct_option = [];
    this.selectedValues = [];
    this.showSubmits = true;
    if (selectedType === 'Verdadero o falso') {
      this.options = ['Falso', 'Verdadero'];
      this.inputType = 'radio';
      this.isTrueFalseQuestion = true;
      this.showPlus = false;
    } else if (selectedType === 'Selección mutiple') {
      this.options = ['', '', ''];
      this.inputType = 'checkbox';
      this.isTrueFalseQuestion = false;
      this.showPlus = true;
    } else if (selectedType === 'Casilla') {
      this.options = ['', ''];
      this.inputType = 'radio';
      this.isTrueFalseQuestion = false;
      this.showPlus = true;
    } else {
      this.showPlus = false;
    }

    this.changeInputType();
    this.cdr.detectChanges();
  }

  async createQuestion(form: any) {
    try {
      const formSection = form.value;

      // Convert question type
      let questionType = '';
      switch (formSection.questionType) {
        case 'Selección mutiple':
          questionType = 'multiple_choice';
          break;
        case 'Verdadero o falso':
          questionType = 'true_false';
          break;
        case 'Casilla':
          questionType = 'simple_choice';
          break;
        default:
          throw new Error('Tipo de pregunta no válido');
      }

      // Validate question text and correct options
      if (!formSection.questionText) {
        this.alertService.showWarning('Por favor, ingrese el texto de la pregunta');
        return;
      }
      console.log(this.correct_option)
      if (questionType === 'multiple_choice') {
        if (this.correct_option.length < 2) {
          this.alertService.showWarning('Por favor, seleccione al menos dos opciones correctas');
        return;
        }
      } else{
        if (this.correct_option.length === 0) {
          this.alertService.showWarning('Por favor, seleccione una opción correcta');
        return;
      }}

      // Prepare options, filtering out undefined or empty options
      const options = [
        formSection?.option0,
        formSection?.option1,
        formSection?.option2,
        formSection?.option3,
        formSection?.option4,
        formSection?.option5,
      ].filter(
        option =>
          option !== undefined && option !== null && option.trim() !== ''
      );

      // Validate options based on question type
      if (
        (questionType === 'true_false' && options.length !== 2) ||
        (questionType === 'simple_choice' && options.length !== this.options.length) ||
        (questionType === 'multiple_choice' && options.length !== this.options.length)
      ) {
        this.alertService.showWarning(
          'Ingrese el texto en todas las opciones'
        );
        return;
      }

      // Validate correct options
      const maxOptionIndex = options.length - 1;
      const invalidCorrectOptions = this.correct_option.some(
        opt => opt > maxOptionIndex
      );
      if (invalidCorrectOptions) {
        this.alertService.showWarning('Selección de opciones correctas no válida');
        return;
      }

      const question = {
        question: formSection.questionText,
        seniority: this.quizData.seniority,
        type: questionType,
        options: options,
        correct_option: this.correct_option,
        explanation: formSection.explanation || '',
        link: formSection.link || '',
        is_active: true,
      };

      this.temporaryQuestions.push(question);
      this.pop = true;
      this.questions.push(formSection);

      // Reset form
      form.reset();
      this.selectedOption = '';
      this.isFocused = false;
      this.options = [];
      this.correct_option = [];

      // If we have 10 questions, create the quiz with all questions
      if (this.temporaryQuestions.length === 10) {
        const quizWithQuestions = {
          ...this.quizData,
          questions: this.temporaryQuestions,
        };
        this.showForm = false;

        console.log('Sending quiz data:', JSON.stringify(quizWithQuestions));

        const response = await fetch(`${environment.url}/quiz/nested`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(quizWithQuestions),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Full error response:', errorText);
          throw new Error(`Error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        this.quizID = data.id;
        this.pop = true;
      }
    } catch (error) {
      console.error('Detailed error:', error);
      this.alertService.showError(error.message || 'Error al crear el cuestionario');
    }
  }

  editQuiz(): void {
    this.showForm = false;
    this.createOrEdit = false;
    this.toggle = true;
    this.isValidInput();
    this.showButton = true;
  }

  addOption() {
    if (this.options.length < 6) {
      this.options.push('');
      if (this.options.length === 6) {
        this.showPlus = false;
      }
    }
  }
}
