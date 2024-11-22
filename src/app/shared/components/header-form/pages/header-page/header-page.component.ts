import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, MinLengthValidator, Validators } from '@angular/forms';
import { HeaderPageService } from './header-page.service';
import { Module, Cell, Seniority } from './header-page.interface';

@Component({
  selector: 'app-header-page',
  templateUrl: './header-page.component.html',
  styleUrl: './header-page.component.scss',
})

export class HeaderPageComponent {
  @Input() mode: boolean = true;
  @Input() editMode: boolean = true ;
  @Output() datosParaPadre = new EventEmitter<any>(); // cambie a any
  public selectHeaderForm: FormGroup;
  constructor(private formsBuilder: FormBuilder) {}
  
  private headerPageService = inject(HeaderPageService)
  modules: Module[] = []
  cells: Cell[] = []
  
  ngOnInit(): void {
    //Consulta los modulos y las celullas que tiene anidadas
    this.headerPageService.getModules().subscribe(( response: any) => {
      this.modules= response
    })
  }
  
  showModulo: boolean = false;
  showCelula: boolean = false;
  showSeniority: boolean = false;
  addModule: boolean = false;
  addCell: boolean = false;
  newModuleName: string = '';

  quizCategory: any = {
    module: '',
    cell: '',
    seniority: '',
    cellClass: '',
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
    this.quizCategory.cellClass= ''
    this.showModulo = false;
    this.datosParaPadre.emit(this.quizCategory);

  }
  selectCell(cell: Cell, index: number) {
    this.quizCategory.cell = cell.name
    this.quizCategory.cellClass = this.getCellClass(index)
    this.showCelula = false;
    this.datosParaPadre.emit(this.quizCategory);
  }
  
  selectSeniority(seniority: string) {
    this.quizCategory.seniority= seniority;
    this.showSeniority = false;
    this.datosParaPadre.emit(this.quizCategory);
  }

  createModule() {
    if (this.selectHeaderForm.get('modulo').valid) {
      console.log(this.newModuleName)
      this.headerPageService.createModule(this.selectHeaderForm.get('modulo').value).subscribe({
        next: (newModule) => {
          this.editMode = false;
          this.headerPageService.getModules().subscribe(( response: any) => {
            this.modules= response
          })
        },
        error: (error) => {
          console.error('Error al crear módulo', error);
          // Manejar error (mostrar mensaje al usuario)
        }
      });
    }
  }
  deleteModule(id: string) {
    this.headerPageService.deleteModule(id).subscribe((response:any)=>{})
    this.headerPageService.getModules().subscribe(( response: any) => {
      this.modules= response
    })
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
  toggleEditMode() {
    this.editMode = !this.editMode;
    this.newModuleName = '';
  }
  getSelectedSeniorityClass(): string{
    const selected = this.seniorities.find(s => s.name ===this.quizCategory?.seniority)
    return selected?.class || ''
  }

  getCellClass(index: number): string {
    const cellNumber = (index % 10) + 1;  // Esto asegura que si hay más de 10 células, los colores se repitan
    return `cell-color-${cellNumber}`;
  }
  
}
