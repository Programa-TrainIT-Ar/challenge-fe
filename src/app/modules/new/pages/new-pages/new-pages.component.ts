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

    // enviar el formulario
    onSubmit(form: any) {
        console.log('Formulario enviado', form.value);
    }

    // Crear una nueva pregunta
    addNewQuestion(form: any) {
        console.log('Nueva pregunta agregada');
        form.resetForm();
        this.options = ['Opción 1'];  // Reiniciar las opciones
    }

}
