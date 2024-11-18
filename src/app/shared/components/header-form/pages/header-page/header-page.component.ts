import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HeaderPageService } from './header-page.service';
import { Module, Cell, Seniority } from './header-page.interface';

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
  
  private headerPageService = inject(HeaderPageService)
  modules: Module[] = []
  cells: Cell[] = []
  
  ngOnInit(): void {
    
    this.selectHeaderForm = this.formsBuilder.group({
      nombreQuiz: [''],
      descripcion: [''],
      modulo: [''],
    });
    //Consulta los modulos y las celullas que tiene anidadas
    this.headerPageService.getModules().subscribe(( response: any) => {
      this.modules= response
    })
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
  
  showModulo: boolean = false;
  showCelula: boolean = false;
  showSeniority: boolean = false;
  
  quizCategory: any = {
    module: '',
    cell: '',
    seniority: '',
    colorCell: '',
  };
  
  seniorities: Seniority[]=[
    {class: 'trainee', name: 'Trainee'},
    {class: 'junior', name: 'Junior'},
    {class: 'middle', name: 'Middle'},
    {class: 'senior', name: 'Senior'},
    ]

  selectModule(module: Module) {
    this.quizCategory.module = module.name
    this.cells = module.cell;
    this.quizCategory.cell= ''
    this.showModulo = false;
    this.datosParaPadre.emit(this.quizCategory);

  }
  selectCell(cell: Cell, colorCell: string) {
    this.quizCategory.cell = cell.name
    this.quizCategory.colorCell = colorCell
    this.showCelula = false;
    this.datosParaPadre.emit(this.quizCategory);
  }
  selectSeniority(seniority: string) {
    this.quizCategory.seniority= seniority;
    this.showSeniority = false;
    this.datosParaPadre.emit(this.quizCategory);
  }

  isShowModulo() {
     if (this.mode) {
      this.showModulo = !this.showModulo;
      this.showCelula = false;
      this.showSeniority = false;
    }
  }
  isShowCelula() {
    if (this.mode) {
      this.showCelula = !this.showCelula;
      this.showSeniority = false;
      this.showModulo = false;
    }
  }
  isShowSeniority() {
    if (this.mode) {
      this.showSeniority = !this.showSeniority;
      this.showCelula = false;
      this.showModulo = false;
    }
  }
  getSelectedSeniorityClass(): string{
    const selected = this.seniorities.find(s => s.name ===this.quizCategory?.seniority)
    return selected?.class || ''
  }
}
