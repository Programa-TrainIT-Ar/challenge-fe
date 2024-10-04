import { Component } from '@angular/core';

@Component({
  selector: 'app-new-pages',
  templateUrl: './new-pages.component.html',
  styleUrls: ['./new-pages.component.scss'],
})
export class NewPagesComponent {
  constructor() {}

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
  
  showForm: any = false;
  options: string[] = [];
  selection: string[] = [''];
  array: string[] = [''];
  selectedOption: string = '';
  isTrueFalseQuestion: boolean = false;
  showPlus: boolean = false;
  showPlus2: boolean = false;
  showSubmits: boolean = false;
  inputType: string = '';

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
  recibirDatos(datos: any) {
    if (
      datos.modulo != 'Selecciona la célula' &&
      datos.seniority != 'Seniority'
    ) {
      this.showForm = true;
    }
    console.log(datos);
    
  }

  answerChoice(i: number, type: string, form: any) {
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
    this.options.push(`Opción ${this.options.length + 1 + '.'}`);
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
