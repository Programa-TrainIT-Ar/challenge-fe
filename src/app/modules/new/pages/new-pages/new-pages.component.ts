import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';
import { ChangeDetectorRef } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-new-pages',
  templateUrl: './new-pages.component.html',
  styleUrls: ['./new-pages.component.scss'],
})
export class NewPagesComponent {
  constructor(
    private formsBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private auth: AuthService
  ) {}

  public selectNameForm = this.formsBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
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

  questionText: string = '';
  questions: any[] = [];
  options: string[] = [];
  selection: number[] = [];
  selectedOption: string = '';
  inputType: string = '';
  showButton: boolean = false;
  pop: boolean = false;
  showForm: boolean = false;
  isTrueFalseQuestion: boolean = false;
  showPlus: boolean = false;
  showSubmits: boolean = false;
  quizID: string = '';
  quizData: any = {};
  createOrEdit: boolean = true;
  toggle: boolean = true;
  isFocused: boolean = false;
  correct_option: number[] = [];
  selectedValues: boolean[] = [];
  inputsValues: boolean = false;
  temporaryQuestions: any[] = [];

  isFieldInvalid(field: string): boolean {
    const control = this.selectNameForm.get(field);
    return control?.invalid && (control.dirty || control.touched);
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

  showInput: boolean = true;
  selectedRadio: string | null = null;

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
    this.cdr.detectChanges();
  }

  isValidInput() {
    if (
      this.selectNameForm.value.name &&
      this.selectNameForm.value.description &&
      this.selectNameForm.valid
    ) {
      this.inputsValues = true;
    } else {
      this.inputsValues = false;
    }
  }

  async recibirDatos(datos: any) {
    if (
      datos.celula != '' &&
      datos.modulo != '' &&
      datos.seniority != ''
    ) {
      this.showButton = true;
    } else {
      this.showButton = false;
    }

    try {
      let responseModule: any = await fetch(`${environment.url}/modules`);
      responseModule = await responseModule.json();
      responseModule = responseModule.find(
        element => element.name == datos.module
      );
      this.quizData.module = responseModule.id;

      let response: any = await fetch(`${environment.url}/cells`);
      response = await response.json();
      response = response.find(element => datos.cell == element.name);
      response ? (this.quizData.cell = response.id) : '';

      if (datos.seniority) {
        this.quizData.seniority = datos.seniority;
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Error al obtener datos del módulo o célula');
    }
  }

  async createQuiz() {
    try {
      this.quizData.seniority =
        this.quizData.seniority === 'semi-sr'
          ? 'middle'
          : this.quizData.seniority;
      const user = await firstValueFrom(this.auth.user$);

      if (!user?.email) {
        throw new Error('No se encontró el email del usuario autenticado');
      }

      const userResponse = await fetch(
        `${environment.url}/user/FindByEmail?email=${user.email}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!userResponse.ok) {
        throw new Error('Error al obtener el usuario desde el backend');
      }

      const userData = await userResponse.json();

      if (!userData?.id) {
        throw new Error('No se encontró el ID del usuario en la base de datos');
      }

      // Mostrar el formulario para agregar preguntas
      this.showForm = true;
      this.toggle = false;
      this.showButton = false;

      // Guardar los datos del quiz para usarlos cuando tengamos todas las preguntas
      this.quizData = {
        name: this.selectNameForm.value.name,
        description: this.selectNameForm.value.description,
        cell_id: this.quizData.cell,
        seniority: this.quizData.seniority?.toLowerCase(),
        challenge_type: 'immediate',
        created_by_id: userData.id,
        is_active: true,
      };

      this.questionCategory.name = this.selectNameForm.value.name;
      this.questionCategory.description = this.selectNameForm.value.description;
    } catch (error) {
      console.error('Error preparando el quiz:', error);
      alert(error.message || 'Error al preparar el quiz');
      this.showButton = false;
    }
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
        alert('Por favor, ingrese el texto de la pregunta');
        return;
      }

      if (this.correct_option.length === 0) {
        alert('Por favor, seleccione al menos una opción correcta');
        return;
      }

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
        (questionType === 'simple_choice' && options.length < 2) ||
        (questionType === 'multiple_choice' && options.length < 3)
      ) {
        alert(
          'Número de opciones inválido para el tipo de pregunta seleccionado'
        );
        return;
      }

      // Validate correct options
      const maxOptionIndex = options.length - 1;
      const invalidCorrectOptions = this.correct_option.some(
        opt => opt > maxOptionIndex
      );
      if (invalidCorrectOptions) {
        alert('Selección de opciones correctas no válida');
        return;
      }

      const question = {
        question: formSection.questionText,
        seniority: this.quizData.seniority || 'junior',
        type: questionType,
        options: options,
        correct_option: this.correct_option,
        explanation: formSection.explanation || '',
        link: formSection.link || '',
        is_active: true,
      };

      this.temporaryQuestions.push(question);
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

        // Optional: Add a reload after a delay
        // setTimeout(() => {
        //   this.closeFn();
        //   window.location.reload();
        // }, 2000);
      }
    } catch (error) {
      console.error('Detailed error:', error);
      alert(error.message || 'Error al crear el cuestionario');
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
      this.options.push(`Opción ${this.options.length + 1}`);
      if (this.options.length === 6) {
        this.showPlus = false;
      }
    }
  }
}
