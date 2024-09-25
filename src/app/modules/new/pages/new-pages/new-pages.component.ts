import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-pages',
  templateUrl: './new-pages.component.html',
  styleUrls: ['./new-pages.component.scss'],
})
export class NewPagesComponent {
  public selectHeaderForm: FormGroup;
  constructor(private formsBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.selectHeaderForm = this.formsBuilder.group({
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
  selection: string[] = [];
  coso: string[] = [];
  selectedOption: string | null = null;

  isTrueFalseQuestion: boolean = false;
  showPlus: boolean = false;
  showSubmits: boolean = false;
  inputType: string = '';

  // DETECTA EL CAMBIO DE PREGUNTA
  onQuestionTypeChange(selectedType: string) {
    if (selectedType === 'Verdadero o falso') {
      this.isTrueFalseQuestion = true;
      // Si es verdadero o falso muestra estas opciones nada mas
      this.options = ['Verdadero', 'Falso'];
      this.showPlus = false;
      this.showSubmits = true;
      this.inputType = 'radio';
    } else if (selectedType === 'Selección mutiple') {
      this.isTrueFalseQuestion = false;
      // Volver a permitir opciones personalizadas
      this.options = ['Opción 1', 'Opción 2', 'Opción 3'];
      this.showPlus = true;
      this.showSubmits = true;
      this.inputType = 'checkbox';
    } else if (selectedType == 'Casilla') {
      this.isTrueFalseQuestion = false;
      this.showPlus = false;
      this.options = ['Opción 1', 'Opción 2'];
      this.showSubmits = true;
      this.inputType = 'radio';
    }
  }

  send(): any {
    console.log(this.selectHeaderForm.value);
  }
  choose(i: number, type: string) {
    if (type === 'radio') {
      this.coso = [];
      this.coso.push(this.options[i]);
      this.selection = this.coso;
    } else if (this.coso.includes(this.options[i])) {
      this.coso = this.coso.filter(el => el != this.options[i]);
      this.selection = this.coso;
      console.log(this.coso);
    } else {
      this.coso = this.coso.filter(el => el != 'Verdadero');
      this.coso = this.coso.filter(el => el != 'Falso');
      this.coso.push(this.options[i]);
      this.selection = this.coso;
    }
  }

  addOption() {
    this.options.push(`Opción ${this.options.length + 1}`);
  }

  // enviar el formulario
  onSubmit(form: any) {
    const formHeader = this.selectHeaderForm.valid;
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
