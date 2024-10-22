import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../environments/environment';

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
  showButton: boolean = false;
  showForm: boolean = false;
  isTrueFalseQuestion: boolean = false;
  showPlus: boolean = false;
  showPlus2: boolean = false;
  showSubmits: boolean = false;
  quizID: number | string = '';
  quizData: any = {};
  createOrEdit: boolean = true;
  toggle: boolean = true;

  trackByFn(index: number): any {
    return index;
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

  async recibirDatos(datos: any) {
    if (
      this.selectNameForm.valid &&
      datos.celula != 'Selecciona la célula' &&
      datos.modulo != 'Selecciona el modulo' &&
      datos.seniority != 'Seniority'
    ) {
      this.showButton = true;
    }

    /* modulo */
    
    let responseModule: any = await fetch(`${environment.url}/modules`)
    responseModule = await responseModule.json()

    responseModule = responseModule.find((element)=>element.name == datos.module )
    console.log(responseModule)
    this.quizData.module = responseModule.id

    /* celula */

    let response: any = await fetch(`${environment.url}/cells`);
    response = await response.json();
    console.log(response);

    response = response.find(element => datos.cell == element.name);

    console.log(response);
    response ? (this.quizData.cell = response.id) : '';
    console.log(this.quizData);

    /* seniority */
    if (datos.seniority) {
      this.quizData.seniority = datos.seniority;
    }
  }
  async createQuiz() {
    try {
      const prueba = {
        name: this.selectNameForm.value.name,
        description: this.selectNameForm.value.description,

        cell_id: this.quizData.cell,
        seniority: this.quizData.seniority,
        challenge_type: 'immediate',
        created_by_id: '224742e8-731b-40bf-b05f-a7547270746c',
        is_active: true,
      };
      const response = await fetch(`${environment.url}/quiz`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(prueba),
      });
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      this.toggle = false;
      this.showForm = true;
      this.showButton = false;
      this.questionCategory.name = this.selectNameForm.value.name;
      this.questionCategory.description = this.selectNameForm.value.description;
      console.log(this.quizData);

      const data = await response.json();
      this.quizID = data.id; /* aca hago global el ID del quiz */
      console.log(data);
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
  }

  async updateQuiz() {
    const update = {
      name: this.selectNameForm.value.name,
      description: this.selectNameForm.value.description,
      cell_id: this.quizData.cell,
      seniority: this.quizData.seniority,
    };
    let response = await fetch(`${environment.url}/quiz/${this.quizID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(update),
    });
    response = await response.json();

    this.showForm = true;
    this.questionCategory.name = this.selectNameForm.value.name;
    this.questionCategory.description = this.selectNameForm.value.description;

    console.log(response);
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
        console.log(form.value);
        /* this.onQuestionTypeChange('otro', 0);  */

        const response = await fetch(`${environment.url}/question`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(question),
        });

        const data = await response.json();

        if (!response.ok) {
          alert(response.status);
          throw new Error(`Error: ${response.status}`);
        }
        this.questions.push(formSection);
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
    this.createOrEdit = false;
    this.toggle = true;
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
