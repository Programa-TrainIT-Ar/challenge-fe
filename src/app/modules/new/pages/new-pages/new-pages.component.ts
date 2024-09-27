import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-pages',
  templateUrl: './new-pages.component.html',
  styleUrls: ['./new-pages.component.scss'],
})
export class NewPagesComponent {
  public selectHeaderForm: FormGroup;
  public titleForm: FormGroup;
  constructor(private formsBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.selectHeaderForm = this.formsBuilder.group({
      nombreQuiz :['', Validators.required],
      descripcion: ['', Validators.required],
      modulo: ['', Validators.required],
      celula: ['', Validators.required],
      level: ['', Validators.required],
    });

  }

  questionTypes: string[] = [
    'Selección mutiple',
    'Casilla',
    'Verdadero o falso',
  ];

  

  options: string[] = [];
  selection: string[] = [''];
  array: string[] = [''];
  selectedOption: string | null = null;

  isTrueFalseQuestion: boolean = false;
  showPlus: boolean = false;
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
      this.showSubmits = true;
      this.inputType = 'radio';
    } else if (selectedType === 'Selección mutiple') {
      this.isTrueFalseQuestion = false;
      this.options = ['Opción 1', 'Opción 2', 'Opción 3'];
      this.showPlus = true;
      this.showSubmits = true;
      this.inputType = 'checkbox';
    } else if (selectedType == 'Casilla') {
      this.isTrueFalseQuestion = false;
      this.showPlus = true;
      this.showSubmits = true;
      this.inputType = 'radio';
      this.options = [
        'Opción 1.',
        'Opción 2.',
      ]; /* haciendo distinto el valor funciona */
      /* Pero al agregar un campo el problema vuelve a surgir */
    }
  }

  answerChoice(i: number, type: string, form: any) {
    if (type === 'radio') {
      this.array =
        []; /* <--- este array se crea porque no permite hacer push a selection directamente */
      this.selection =
        []; /* <--- 'DEBERIA' limpiar el array, pero en modo 'CASILLA' no se limpia */
      this.array.push(this.options[i]);
      this.selection = this.array;
      console.log(this.selection);
    } else if (this.array.includes(this.options[i])) {
      this.array = this.array.filter(el => el != this.options[i]);
      this.selection = this.array;
      console.log(this.array);
    } else {
      this.array = this.array.filter(el => el != 'Verdadero');
      this.array = this.array.filter(el => el != 'Falso');
      this.array.push(this.options[i]);
      this.selection = this.array;
    }
  }

  send(): any {
    console.log(this.selectHeaderForm.value);
  }

  addOption() {
    this.options.push(`Opción ${this.options.length + 1}`);
  }

  // enviar el formulario
  onSubmit(form: any) {
    const formHeader = this.selectHeaderForm.value;
    const formSection = form.value;
    console.log(formSection);
    console.log(formHeader);
    
  }
  // Crear una nueva pregunta
  addNewQuestion(form: any) {
    console.log('Nueva pregunta agregada');
    form.resetForm();
    this.options = ['Opción 1']; // Reiniciar las opciones
  }
}
