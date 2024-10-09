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
    name: [''],
  });

  ngOnInit(): void {}

  questionTypes: string[] = [
    'Selección mutiple',
    'Casilla',
    'Verdadero o falso',
  ];

  questionClass: string = '';
  questionCategory: any = {
    modulo: 'Selecciona la célula',
    seniority: 'Seniority',
  };

  options: string[] = [];
  selection: string[] = [''];
  array: string[] = [''];
  selectedOption: string = '';
  inputType: string = '';
  showButton: boolean = false;
  showForm: boolean = false;
  isTrueFalseQuestion: boolean = false;
  showPlus: boolean = false;
  showPlus2: boolean = false;
  showSubmits: boolean = false;

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
    }
  }
  recibirDatos(datos: any): void {
    if (
      datos.modulo != 'Selecciona la célula' &&
      datos.seniority != 'Seniority'
    ) {
      this.showButton = true;
    }
    console.log(datos);
  }
  async createQuiz() {
    try {
      this.showForm = true;
      this.showButton = false;
      this.questionCategory.name = this.selectNameForm.value.name;

      const prueba = {
        "name": "string2",
        "description": "string2",
        "cell_id": "8840a9c4-a1b1-472e-84e1-5c6506f257f1",
        "seniority": "trainee",
        "challenge_type": "immediate",
        "created_by_id": "f0f41d59-fca3-4266-b24e-042aafce6a6a",
        "is_active": true
      }
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
      console.log(data);
      
    } catch (error) {
      console.error('Error creating quiz:', error);
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

  // enviar el formulario
  onSubmit(form: any) {
    const formSection = form.value;
    console.log(formSection);
  }
  // Crear una nueva pregunta
  addNewQuestion(form: any) {
    console.log('Nueva pregunta agregada');
    form.resetForm();
    this.options = ['Opción 1']; // Reiniciar las opciones
  }
}
