import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-header-page',
  templateUrl: './header-page.component.html',
  styleUrl: './header-page.component.scss'
})
export class HeaderPageComponent {
  public selectHeaderForm: FormGroup;
  constructor(private formsBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.selectHeaderForm = this.formsBuilder.group({
      nombreQuiz: [''],
      descripcion: [''],
      modulo: [''],
    });
    this.showCelula = false;
  }

  showCelula: boolean = false;
  showSeniority: boolean = false;
  questionCategory: any = {
    modulo: 'Selecciona la célula',
    seniority: 'Seniority',
  };

  isShowCelula() {
    this.showCelula = !this.showCelula;
    this.showSeniority = false;
  }
  isShowSeniority() {
    this.showSeniority = !this.showSeniority;
    this.showCelula = false;
  }
}
