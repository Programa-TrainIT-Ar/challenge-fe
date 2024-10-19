import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header-page',
  templateUrl: './header-page.component.html',
  styleUrl: './header-page.component.scss',
})
export class HeaderPageComponent {
  @Output() datosParaPadre = new EventEmitter<any>();// cambie a any
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
    module: 'Selecciona el modulo',
    cell: 'Selecciona la célula',
    seniority: 'Seniority',
  };
  options: any = ['','']

  async getCells(){
    let response = await fetch(`${environment.url}'cells'`)
    response = await response.json()
    
    this.options.push(response)
    console.log(this.options);
    
  }
  

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
    
    console.log(this.options);
    
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
