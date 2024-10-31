import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';

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

  questionText: string = '';
  questions: any = [];
  options: string[] = [];
  selection: number[] = [];
  
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
  isFocused: boolean = false;
  correct_option: number[] = [] 

  trackByFn(index: number): any {
    return index;
  }

  answerChoice(i: number, form: any) {
    /* hacer condicional si existe o no existe blabla */
    if(this.correct_option.includes(i)){
      this.correct_option = this.correct_option.filter((element)=>
        element!=i)
    }else {
      this.correct_option.push(i);
    }
     console.log(this.correct_option);
    }
  

    
    onQuestionTypeChange(selectedType: string, form: any) {
      this.correct_option = []
      console.log(this.correct_option);
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

  async recibirDatos(datos: any) {
    if (
      this.selectNameForm.value.description &&
      this.selectNameForm.valid &&
      datos.celula != 'Selecciona la célula' &&
      datos.modulo != 'Selecciona el modulo' &&
      datos.seniority != 'Seniority'
    ) {
      this.showButton = true;
    }

    /* modulo */

    let responseModule: any = await fetch(`${environment.url}/modules`);
    responseModule = await responseModule.json();

    responseModule = responseModule.find(
      element => element.name == datos.module
    );

    this.quizData.module = responseModule.id;

    /* celula */

    let response: any = await fetch(`${environment.url}/cells`);
    response = await response.json();
    response = response.find(element => datos.cell == element.name);
    response ? (this.quizData.cell = response.id) : '';

    /* seniority */
    if (datos.seniority) {
      this.quizData.seniority = datos.seniority;
    }
  }

  async createQuiz() {
    try {
      this.quizData.seniority == 'semi-sr'
        ? (this.quizData.seniority = 'middle')
        : this.quizData;

      const prueba = {
        name: this.selectNameForm.value.name,
        description: this.selectNameForm.value.description,
        cell_id: this.quizData.cell,
        seniority: this.quizData.seniority,
        challenge_type: 'immediate',
        created_by_id: '224742e8-731b-40bf-b05f-a7547270746c',
        is_active: true,
      };

      if (
        this.selectNameForm.value.description &&
        this.selectNameForm.value.name
      ) {
        const response = await fetch(`${environment.url}/quiz`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(prueba),
        });
        if (!response.ok) {
          alert(response.status);
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();
        this.quizID = data.id;
        this.showForm = true;
        this.toggle = false;
        this.showButton = false;
        this.questionCategory.name = this.selectNameForm.value.name;
        this.questionCategory.description =
          this.selectNameForm.value.description;
      } else {
        alert('complete los datos requeridos');
        this.showButton = false;
      }
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
  }

  isDisabled(index: number): any {
    return this.selection[index] || false;
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


      if ( formSection.questionText && this.correct_option.length != 0) {
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
          correct_option: this.correct_option,
          explanation: 'string',
          link: 'string',
          is_active: true,
          /* quiz_id: '168b2a93-7358-48cb-951a-793281c35983', */
           quiz_id: this.quizID, 
        };

        const response = await fetch(`${environment.url}/question`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(question),
        });

        const data = await response.json();
        if (!response.ok) {
          alert(response);
          throw new Error(`Error: ${response.status}`);
        }

        console.log(data);
        this.questions.push(formSection);

        form.reset();
        this.options = [];
      } else {
        alert('complete los campos requeridos');
        console.log(this.correct_option);
      }

      if (this.questions.length == 10000) {
        alert('10 preguntas cargadas con exito');
        window.location.reload();
      }
      
    } catch (error) {
      alert(error);
      console.error(error);
    }
  }

  editQuiz(): void {
    this.showForm = false;
    this.createOrEdit = false;
    this.toggle = true;
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
