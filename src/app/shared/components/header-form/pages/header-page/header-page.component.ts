import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-header-page',
  templateUrl: './header-page.component.html',
  styleUrl: './header-page.component.scss',
})
export class HeaderPageComponent {
  @Output() datosParaPadre = new EventEmitter<boolean>();
  public selectHeaderForm: FormGroup;
  constructor(private formsBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.selectHeaderForm = this.formsBuilder.group({
      nombreQuiz: [''],
      descripcion: [''],
      modulo: [''],
    });
  }

  showModulo: boolean = false;
  showCelula: boolean = false;
  showSeniority: boolean = false;
  questionCategory: any = {
    module: 'Selecciona el modulo guacho',
    cell: 'Selecciona la célula',
    seniority: 'Seniority',
  };

  pushQuestionCategory(prop: string, val: string, id:string): void {
    this.questionCategory[prop] = val;
    this.questionCategory[id] = id;
   
    this.datosParaPadre.emit(this.questionCategory);
  }

  isShowModulo() {
    this.showModulo = !this.showModulo;
    this.showCelula = false;
    this.showSeniority = false;
  }
  isShowCelula() {
    this.showCelula = !this.showCelula;
    this.showSeniority = false;
    this.showModulo = false;
  }
  isShowSeniority() {
    this.showSeniority = !this.showSeniority;
    this.showCelula = false;
    this.showModulo = false;
  }

}
