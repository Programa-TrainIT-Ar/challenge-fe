import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-header-page',
  templateUrl: './header-page.component.html',
  styleUrl: './header-page.component.scss',
})
export class HeaderPageComponent {
  @Input() mode: boolean = true;
  @Output() datosParaPadre = new EventEmitter<any>(); // cambie a any
  public selectHeaderForm: FormGroup;
  constructor(private formsBuilder: FormBuilder) {}

  ngOnInit(): void {
    console.log(this.mode);
    this.selectHeaderForm = this.formsBuilder.group({
      nombreQuiz: [''],
      descripcion: [''],
      modulo: [''],
    });
  }
  colorsCells: string[] = [
    '#ffcc00',
    '#ff9500',
    '#34c759',
    '#00c7be',
    '#30b0c7',
    '#32ade6',
    '#007aff',
    '#007AFF',
    '#ff2d55',
    '#af52de',
    '#5856d6',
    '#007aff',
  ];
  colorsSeniority: string[] = ['#ff2d55', '#af52de', '#5856d6', '#007aff'];
  showModulo: boolean = false;
  showCelula: boolean = false;
  showSeniority: boolean = false;
  questionCategory: any = {
    module: 'Selecciona el modulo',
    cell: 'Selecciona la célula',
    seniority: 'Seniority',
    colorCell: '',
  };
  opModules: any = [];
  opCells: any = [];

  async getModule() {
    let response = await fetch(`${environment.url}/modules`);
    response = await response.json();
    this.opModules = response;
  }
  async getCells() {
    /* no pude reutilizar fn anterior con parametros */
    let response = await fetch(`${environment.url}/cells`);
    response = await response.json();
    this.opCells = response;
  }

  pushQuestionCategory(prop: string, val: string, color: string): void {
    this.questionCategory[prop] = val;
    if (prop == 'cell') {
      this.questionCategory.colorCell = color;
    }

    this.datosParaPadre.emit(this.questionCategory);
  }

  isShowModulo() {
    /* if(mode){

    } */ if (this.mode) {
      this.getModule();
      this.showModulo = !this.showModulo;
      this.showCelula = false;
      this.showSeniority = false;
    }
    console.log(this.opModules);
  }
  isShowCelula() {
    if (this.mode) {
      this.getCells();

      this.showCelula = !this.showCelula;
      this.showSeniority = false;
      this.showModulo = false;
    }
    console.log(this.opCells);
  }
  isShowSeniority() {
    if (this.mode) {
      this.showSeniority = !this.showSeniority;
      this.showCelula = false;
      this.showModulo = false;
    }
  }
}
