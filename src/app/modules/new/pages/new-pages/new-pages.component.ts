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
    /*     name: ['', Validators.required],
    description: ['', Validators.required], */
    name: [''],
    description: [''],
  });

  ngOnInit(): void {}

  questionTypes: string[] = [
    'Selección mutiple',
    'Casilla',
    'Verdadero o falso',
  ];

  questionClass: string = '';
  questionCategory: any = {
    module: 'Selecciona la célula',
    seniority: 'Seniority',
  };

  questions: any = [];
  options: string[] = [];
  selection: string[] = [''];
  array: string[] = [''];
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
    if (datos.module == 'Desarrollo') {
      this.quizData.module = 'ID DE DESARROLLO';
    } else if (datos.module == 'Marketing') {
      this.quizData.module = 'ID DE MARKETING';
    } else if (datos.module == 'Sistemas') {
      this.quizData.module = '84c66f03-c98f-47f1-a461-589cfb3dbf1f';
    }

    /* celula */

    if (datos.cell == 'Diseño-UX-UI') {
      this.quizData.cell = '03f5d507-5116-4561-be80-51283bbc9af6';
    } else if (datos.cell == 'QA-Tester') {
      this.quizData.cell = '8da491e5-1524-4d3e-bb64-5aaff31bfdf9';
    } else if (datos.cell == 'Frontend') {
      this.quizData.cell = '7165ac32-abb2-46ce-a9b7-1b1cd325026b';
    } else if (datos.cell == 'Backend') {
      this.quizData.cell = 'c98b1012-5992-4b70-b704-d1964e9c7a52';
    } else if (datos.cell == 'PM') {
      this.quizData.cell = '4c807a63-ae60-4935-bef7-89ad7391205c';
    } else if (datos.cell == 'Scrum-Master') {
      this.quizData.cell = '84c66f03-c98f-47f1-a461-589cfb3dbf1f';
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
        created_by_id: '00ff40f6-8f8f-433f-8306-0abb0001cf08',
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

      if (formSection.questionType == 'Selección mutiple') {
        formSection.questionType = 'multiple_choice';
      } else if (formSection.questionType == 'Verdadero o falso') {
        formSection.questionType = 'true_false';
      } else if (formSection.questionType == 'Casilla') {
        formSection.questionType = 'simple_choice';
      }
      formSection.solution = formSection.solution.map(element => {
        if (element.includes('.')) {
          return (element = parseInt(element[element.length - 2]));
        }
        return (element = parseInt(element[element.length - 1]));
      });
      console.log(formSection.solution);
      let question = {
        question: formSection.questionText,
        seniority: 'junior',
        type: formSection.questionType,
        options: ['string'],
        correct_option: formSection.solution, 
        explanation: 'string',
        link: 'string',
        is_active: true,
        quiz_id: this.quizID,
      };
      if (this.questions.length <= 5) {
        this.questions.push(formSection);
        console.log(form.value);
        this.onQuestionTypeChange('otro');

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

        console.log(data);
      } else {
        console.log('estan las 5');
      }
    } catch (error) {
      console.error('Error creating question:', error);
    }
  }

  editQuiz(): void {
    this.showForm = false;
  }
  answerChoice(i: number, type: string) {
    if (type === 'radio') {
      this.array =
        []; /* <--- este array se crea porque no permite hacer push a selection directamente */
      this.selection =
        []; /* <--- 'DEBERIA' limpiar el array, pero en modo 'CASILLA' no se limpia */
      this.array.push(this.options[i]);
      this.selection = this.array;
    } else if (this.array.includes(this.options[i])) {
      this.array = this.array.filter(el => el != this.options[i]);
      this.selection = this.array;
    } else {
      this.array = this.array.filter(el => el != 'Verdadero');
      this.array = this.array.filter(el => el != 'Falso');
      this.array.push(this.options[i]);
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

  // Crear una nueva pregunta
  addNewQuestion(form: any) {
    console.log('Nueva pregunta agregada');
    form.resetForm();
    this.options = ['Opción 1']; // Reiniciar las opciones
  }
}
