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
  colors: string[] = ['#ffcc00', '#ff9500', '#34c759', '#00c7be', '#30b0c7', '#32ade6', '#007aff'];
  showModulo: boolean = false;
  showCelula: boolean = false;
  showSeniority: boolean = false;
  questionCategory: any = {
    module: 'Selecciona el modulo',
    cell: 'Selecciona la célula',
    seniority: 'Seniority',
    colorCell: ''
  };
  options: any = []
  
  async getCells(){
    let response = await fetch(`${environment.url}/cells`)
    response = await response.json()
    this.options = response
    console.log(response)
    console.log(this.options);
    
  }
  

  pushQuestionCategory(prop: string, val: string, colorCell: string): void {
    this.questionCategory[prop] = val;
    if(prop=='cell'){
   this.questionCategory.colorCell = colorCell}
   
    this.datosParaPadre.emit(this.questionCategory);
  }

  isShowModulo() {
    this.showModulo = !this.showModulo;
    this.showCelula = false;
    this.showSeniority = false;
  }
  isShowCelula() {
    console.log(environment.url)
    
    this.getCells()
    
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
