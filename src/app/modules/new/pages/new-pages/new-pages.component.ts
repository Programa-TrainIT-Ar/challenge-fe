import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-pages',
  templateUrl: './new-pages.component.html',
  styleUrls: ['./new-pages.component.scss'],
})
export class NewPagesComponent {
  public createHeaderForm: FormGroup;
  constructor(private formsBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createHeaderForm = this.formsBuilder.group({
      modulo: ['', Validators.required],
      celula: ['', Validators.required],
      level: ['', Validators.required],
    });
  }

  send(): any {
    console.log(this.createHeaderForm.value);
  }

  questionTypes: string[] = [
    'Selección mutiple',
    'Casilla',
    'Verdadero o falso',
  ];
  options: string[] = ['Opción 1', 'Opción 2'];
  selectedOption: string = '';

  isTrueFalseQuestion: boolean = false;

  // DETECTA EL CAMBIO DE PREGUNTA
  onQuestionTypeChange(selectedType: string) {
    if (selectedType === 'Verdadero o falso') {
      this.isTrueFalseQuestion = true;
      // Si es verdadero o falso muestra estas opciones nada mas
      this.options = ['Verdadero', 'Falso'];
    } else {
      this.isTrueFalseQuestion = false;
      // Volver a permitir opciones personalizadas
      this.options = ['Opción 1'];
    }
  }
  addOption() {
    this.options.push(`Opción ${this.options.length + 1}`);
  }
  loge(){
    console.log('hola');
    
  }
  // enviar el formulario
  onSubmit(form: any) {
    console.log('Formulario enviado', form.value);
  }
  // Crear una nueva pregunta
  addNewQuestion(form: any) {
    console.log('Nueva pregunta agregada');
    form.resetForm();
    this.options = ['Opción 1']; // Reiniciar las opciones
  }
}
