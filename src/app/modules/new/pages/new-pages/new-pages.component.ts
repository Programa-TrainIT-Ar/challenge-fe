import { Component } from '@angular/core';

@Component({
    selector: 'app-new-pages',
    templateUrl: './new-pages.component.html',
    styleUrl: './new-pages.component.scss'
})
export class NewPagesComponent {

    questionTypes: string[] = ['Selección mutiple', 'Casilla', 'Verdadero o falso'];
  options: string[] = ['Opción 1'];
  selectedOption: string = '';

  // Agregar una nueva opción
  addOption() {
    this.options.push(`Opción ${this.options.length + 1}`);
  }

  // Acción al enviar el formulario
  onSubmit(form: any) {
    console.log('Formulario enviado', form.value);
  }

  // Crear una nueva pregunta
  addNewQuestion(form:any) {
    console.log('Nueva pregunta agregada');
    form.resetForm();
    this.options = ['Opción 1'];  // Reiniciar las opciones
  }
}
