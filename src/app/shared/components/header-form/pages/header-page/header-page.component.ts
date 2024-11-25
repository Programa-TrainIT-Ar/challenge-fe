import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { HeaderPageService } from './header-page.service';
import { Module, Cell, Seniority } from './header-page.interface';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-header-page',
  templateUrl: './header-page.component.html',
  styleUrl: './header-page.component.scss',
})

export class HeaderPageComponent {
  
  @Input() editMode: boolean; //cambia modo editable a lectura
  @Output() datosParaPadre = new EventEmitter<any>(); //envia al componente padre la seleccion actual
  
  private headerPageService = inject(HeaderPageService)
  
  //Estructura de los dropdown
  modules: Module[] = []
  cells: Cell[] = []
  seniorities: Seniority[]=[
    {class: 'trainee', name: 'Trainee'},
    {class: 'junior', name: 'Junior'},
    {class: 'middle', name: 'Middle'},
    {class: 'senior', name: 'Senior'},
    ]
  //visibilidad de los dropdown
  showModulo: boolean = false;
  showCelula: boolean = false;
  showSeniority: boolean = false;
  //visibilidad del input para agregar modulos o celulas
  addModule: boolean = false;
  addCell: boolean = false;
  //campos de formulario
  module= new FormControl('',[Validators.required, Validators.minLength(3)]);
  editModuleControl= new FormControl('',[Validators.required, Validators.minLength(3)]);
  editingModuleId: string | null = null;
  cell= new FormControl('',[Validators.required, Validators.minLength(3)]);
  //seleccion actual de modulo celula y seniority
  quizCategory: any = {
    module: '',
    cell: '',
    seniority: '',
    cellClass: '',
  };
  
  ngOnInit(): void {
    //Consulta los modulos y las celullas que tiene anidadas
    this.getCategory()
    
  }
  //obtiene los modulos y celulas de la api
  getCategory() {
    this.headerPageService.getModules().subscribe(( response: any) => {
      this.modules= response
    })
  }
  //coloca el modulo como seleccionado y carga las celulas que le corresponden 
  selectModule(module: Module) {
    this.quizCategory.module = module.name
    this.cells = module.cell;
    this.quizCategory.cell= ''
    this.quizCategory.cellClass= ''
    this.showModulo = false;
    this.datosParaPadre.emit(this.quizCategory);
    }
  //coloca la celula como seleccionado y su correspondiente clase
  selectCell(cell: Cell, index: number) {
    this.quizCategory.cell = cell.name
    this.quizCategory.cellClass = this.getCellClass(index)
    this.showCelula = false;
    this.datosParaPadre.emit(this.quizCategory);
  }
  //coloca el seniority como seleccionado
  selectSeniority(seniority: string) {
    this.quizCategory.seniority= seniority;
    this.showSeniority = false;
    this.datosParaPadre.emit(this.quizCategory);
  }
  //Crea un nuevo modulo 
  createModule() {
    if (this.module.valid) {
      this.headerPageService.createModule(this.module.value).subscribe({
        next: (newModule) => {
          this.getCategory()
          this.toggleAddModule()
        },
        error: (error) => {
          console.error('Error al crear módulo', error);
          // Manejar error (mostrar mensaje al usuario)
        }
      });
    }
  }
  // Método para iniciar la edición
  startEditingModule(event: Event, moduleId: string, currentName: string) {
    event.stopPropagation();
    this.editingModuleId = moduleId;
    this.editModuleControl.setValue(currentName);
  }
  // Método para guardar los cambios
  saveModuleEdit(moduleId: string) {
    if (this.editModuleControl.valid) {
      const newName = this.editModuleControl.value;
      this.headerPageService.updateModule(moduleId, newName).subscribe()      
      // Resetear el estado de edición
      this.editingModuleId = null;
      this.editModuleControl.reset();
    }
  }

  // Método para cancelar la edición
  cancelEditingModule() {
    this.editingModuleId = null;
    this.editModuleControl.reset();
  }
  
  //elimina un modulo
  deleteModule(id: string) {
    this.headerPageService.deleteModule(id).pipe(
      // Esperar a que termine el delete
      switchMap(() => {
        // Una vez que termine el delete, obtener la lista actualizada
        return this.headerPageService.getModules();
      })
    ).subscribe({
      next: (response: any) => {
        this.modules = response;
      }
    });
  }
  //Cambia la visibilidad de modulo, celula y seniority
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
  //Cambia la visibilidad del input modulo para agregar un nuevo en el modo edit
  toggleAddModule() {
    this.addModule = !this.addModule;
    this.module.setValue('');
  }
  //Cambia la visibilidad del input celula para agregar una nueva en el modo edit
  toggleAddCell() {
    this.addCell = !this.addCell;
    this.cell.setValue('');
  }
  //Selecciona la clase de seniority que corresponda
  getSelectedSeniorityClass(): string{
    const selected = this.seniorities.find(s => s.name ===this.quizCategory?.seniority)
    return selected?.class || ''
  }
  //Selecciona la clase de celula que corresponda
  getCellClass(index: number): string {
    // Esto asegura que si hay más de 10 células, los colores se repitan
    const cellNumber = (index % 10) + 1;  
    return `cell-color-${cellNumber}`;
  }
}
