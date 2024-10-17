import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-pages',
  templateUrl: './new-pages.component.html',
  styleUrls: ['./new-pages.component.scss'],
})
export class NewPagesComponent {
  constructor(private formsBuilder: FormBuilder) {}
  public selectNameForm = this.formsBuilder.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
  });

  isFieldInvalid(field: string): boolean {
    const control = this.selectNameForm.get(field);
    return control?.invalid && (control.dirty || control.touched);
  }

  questionTypes: string[] = [
    'Selección mutiple',
    'Casilla',
    'Verdadero o falso',
  ];

  questionCategory: any = {
    module: 'Selecciona la célula',
    seniority: 'Seniority',
  };

  questions: any = [];
  options: string[] = [];
  selection: string[] = [''];
  array: any = [''];
  selectedOption: string = '';
  inputType: string = '';
  showButton: boolean = false; /* pasar a false */
  showForm: boolean = false; /* pasar a false */
  isTrueFalseQuestion: boolean = false;
  showPlus: boolean = false;
  showPlus2: boolean = false;
  showSubmits: boolean = false;
  quizID: number | string = '';
  quizData: any = {};

  trackByFn(index: number, item: any): any {
    return index; // Puedes usar el índice como identificador único
  }

  onQuestionTypeChange(selectedType: string) {
    this.array =
      []; /* <--- este array se crea porque no permite hacer push a selection directamente */
    this.selection =
      []; /* <--- 'DEBERIA' limpiar el array, pero en modo 'CASILLA' no se limpia */
    if (selectedType === 'Verdadero o falso') {
      this.isTrueFalseQuestion = true;
      this.options = ['Verdadero', 'Falso'];
      this.showPlus = false;
      this.showPlus2 = false;
      this.showSubmits = true;
      this.inputType = 'radio';
    } else if (selectedType === 'Selección mutiple') {
      this.isTrueFalseQuestion = false;
      this.options = ['Opción 1', 'Opción 2', 'Opción 3'];
      this.showPlus = true;
      this.showPlus2 = false;
      this.showSubmits = true;
      this.inputType = 'checkbox';
    } else if (selectedType == 'Casilla') {
      this.isTrueFalseQuestion = false;
      this.showPlus = false;
      this.showPlus2 = true;
      this.showSubmits = true;
      this.inputType = 'radio';
      this.options = [
        'Opción 1.',
        'Opción 2.',
      ]; /* haciendo distinto el valor funciona */
      /* Pero al agregar un campo el problema vuelve a surgir */
    } else {
      this.isTrueFalseQuestion = false;
      this.options = [];
      this.showPlus = false;
      this.showPlus2 = false;
      this.showSubmits = false;
      this.inputType = 'radio';
      selectedType = 'Tipo de Pregunta';
    }
  }

  recibirDatos(datos: any): void {
    if (
      this.selectNameForm.valid &&
      datos.celula != 'Selecciona la célula' &&
      datos.modulo != 'Selecciona el modulo' &&
      datos.seniority != 'Seniority'
    ) {
      this.showButton = true;
    }

    /* modulo */
    switch (datos.module) {
      case 'Desarrollo':
        this.quizData.module = 'ID DE DESARROLLO';
        break;
      case 'Marketing':
        this.quizData.module = 'ID DE MARKETING';
        break;
      case 'Sistemas':
        this.quizData.module = '84c66f03-c98f-47f1-a461-589cfb3dbf1f';
        break;
    }

    /* celula */

    switch (datos.cell) {
      case 'Diseño-UX-UI':
        this.quizData.cell = '97928084-2555-405c-b6fa-c8fcbd47c3d5';
        break;
      case 'QA-Tester':
        this.quizData.cell = '5901518b-f699-49ce-a034-5d0fe2609345';
        break;
      case 'Frontend':
        this.quizData.cell = '305e2fc8-b898-48f7-b5ea-75fcdb52b17f';
        break;
      case 'Backend':
        this.quizData.cell = 'fe378504-4a60-4de9-8204-e42ca27167d3';
        break;
      case 'PM':
        this.quizData.cell = '989d898a-3ca8-453c-ab2e-1cc4f9510b8c';
        break;
      case 'Scrum-Master':
        this.quizData.cell = 'c4d33b62-b4a4-46b3-ad4f-15471b7fd456';
        break;
      case 'Fullstack':
        this.quizData.cell = '6c88f9e9-ee68-423f-bbf9-cb8af183924f';
        break;
    }

    /* seniority */
    if (datos.seniority) {
      this.quizData.seniority = datos.seniority;
    }
    console.log(this.quizData);
  }
  async createQuiz() {
    try {
      this.showForm = true;
      this.showButton = false;
      this.questionCategory.name = this.selectNameForm.value.name;
      this.questionCategory.description = this.selectNameForm.value.description;
      console.log(this.quizData);

      const prueba = {
        name: this.selectNameForm.value.name,
        description: this.selectNameForm.value.description,

        cell_id: this.quizData.cell,
        seniority: this.quizData.seniority,
        challenge_type: 'immediate',
        created_by_id: '224742e8-731b-40bf-b05f-a7547270746c',
        is_active: true,
      };
      const response = await fetch(
        'https://challenge-be-development-99e1.onrender.com/quiz',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(prueba),
        }
      );
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      this.quizID = data.id; /* aca hago global el ID del quiz */
      console.log(data);
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  }

  async createQuestion(form: any) {
    try {
      const formSection = form.value;

      switch (formSection.questionType) {
        case 'Selección mutiple':
          formSection.questionType = 'multiple_choice';
          break;
        case 'Verdadero o falso':
          formSection.questionType = 'true_false';
          break;
        case 'Casilla':
          formSection.questionType = 'simple_choice';
          break;
      }

      console.log(formSection);
      let question = {
        question: formSection.questionText,
        seniority: 'junior',
        type: formSection.questionType,
        options: [
          formSection?.option0,
          formSection?.option1,
          formSection?.option2,
          formSection?.option3,
          formSection?.option4,
          formSection?.option5,
        ].filter(option => option !== undefined && option !== null),
        correct_option: formSection.solution,
        explanation: 'string',
        link: 'string',
        is_active: true,
        quiz_id: this.quizID,
      };
      if (this.questions.length <= 10) {
        this.questions.push(formSection);
        console.log(form.value);
        /* this.onQuestionTypeChange('otro', 0);  */

        const response = await fetch(
          'https://challenge-be-development-99e1.onrender.com/question',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(question),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          alert(response.status);
          throw new Error(`Error: ${response.status}`);
        }
        console.log(data);
        form.reset();
        this.options = [];
      }
      if (this.questions.length == 10) {
        alert('10 preguntas cargadas con exito');
        window.location.reload();
      }
    } catch (error) {
      alert(error);
      console.error('Error creating question:', error);
    }
  }

  editQuiz(): void {
    this.showForm = false;
  }
  answerChoice(i: number) {
    if (true) {
      this.array =
        []; /* <--- este array se crea porque no permite hacer push a selection directamente */
      this.selection =
        []; /* <--- 'DEBERIA' limpiar el array, pero en modo 'CASILLA' no se limpia */
      this.array.push(i);
      this.selection = this.array;
    }
  }

  addOption() {
    if (this.options.length < 5) {
      this.options.push(`Opción ${this.options.length + 1}`);
    } else {
      this.options.push(`Opción ${this.options.length + 1}`);
      this.showPlus = false;
      this.showPlus2 = false;
    }
  }
  addOption2() {
    if (this.options.length < 5) {
      this.options.push(`Opción ${this.options.length + 1 + '.'}`);
    } else {
      this.options.push(`Opción ${this.options.length + 1 + '.'}`);
      this.showPlus = false;
      this.showPlus2 = false;
    }
  }
}
