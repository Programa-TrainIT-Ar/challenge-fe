import { Component, ElementRef, EventEmitter, HostListener, inject, Input, OnInit, Output } from '@angular/core';
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
  @Input() initialCategory: any; //recibe la seleccion actual del componente padre
  @Input() editMode: boolean; //cambia modo editable a lectura
  @Input() resetButton: boolean; //visivilidad del boton reset
  @Output() datosParaPadre = new EventEmitter<any>(); //envia al componente padre la seleccion actual
  
  private headerPageService = inject(HeaderPageService)
  private elementRef= inject(ElementRef)

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
  editCellControl= new FormControl('',[Validators.required, Validators.minLength(3)]);
  editingCellId: string | null = null;
  //seleccion actual de modulo celula y seniority
  quizCategory: any = {
    module: '',
    moduleId: '',
    cell: '',
    cellId: '',
    cellClass: '',
    seniority: '',
  };
  
  ngOnInit(): void {
    // Consulta los modulos y las celullas que tiene anidadas
    this.getCategory();
  
    // If initial category is provided, set it after modules are loaded
    if (this.initialCategory) {
      this.setInitialCategory();
    }
  }

  setInitialCategory() {
    // Increase delay and add error handling
    setTimeout(() => {
      if (!this.initialCategory) {
        console.warn('No initial category provided');
        return;
      }

      console.log('Initial Category:', this.initialCategory);
      console.log('Available Modules:', this.modules);

      if (this.initialCategory.module) {
        // Use find with more robust matching
        const module = this.modules.find(m => 
          m.name.trim().toLowerCase() === this.initialCategory.module.trim().toLowerCase()
        );

        if (module) {
          console.log('Found Module:', module);
          
          // Select the module
          this.selectModule(module);

          // If cell is provided
          if (this.initialCategory.cell) {
            const cell = module.cell.find(c => 
              c.name.trim().toLowerCase() === this.initialCategory.cell.trim().toLowerCase()
            );

            if (cell) {
              const cellIndex = module.cell.indexOf(cell);
              console.log('Found Cell:', cell, 'at index', cellIndex);
              this.selectCell(cell, cellIndex);
            } else {
              console.warn('Cell not found:', this.initialCategory.cell);
            }
          }

          // If seniority is provided
          if (this.initialCategory.seniority) {
            this.selectSeniority(this.initialCategory.seniority);
          }
        } else {
          console.warn('Module not found:', this.initialCategory.module);
        }
      }
    }, 300);  // Increased delay to 300ms
  }
  //obtiene los modulos y celulas de la api
  getCategory() {
    this.headerPageService.getModules().subscribe(( response: any) => {
      this.modules= response
    })
  }
  
  //Coloca los valores de modulo, celula y seniority vacios
  resetValue() {
    this.quizCategory.module = '';
    this.quizCategory.moduleId = '';
    this.quizCategory.cell = '';
    this.quizCategory.seniority = '';
    this.quizCategory.cellClass = '';
    this.datosParaPadre.emit(this.quizCategory);
  }

  //coloca el modulo como seleccionado y carga las celulas que le corresponden 
  selectModule(module: Module) {
    this.quizCategory.module = module.name;
    this.quizCategory.moduleId = module.id;
    this.cells = module.cell;
    this.quizCategory.cell= ''
    this.quizCategory.cellClass= ''
    this.showModulo = false;
    this.datosParaPadre.emit(this.quizCategory);
    }
  //coloca la celula como seleccionado y su correspondiente clase
  selectCell(cell: Cell, index: number) {
    this.quizCategory.cell = cell.name
    this.quizCategory.cellId = cell.id
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
        next: () => {
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
  //Crea una nueva celula 
  createCell() {
    if (this.cell.valid && this.quizCategory.moduleId) {
      this.headerPageService.createCell(this.cell.value, this.quizCategory.moduleId).pipe(
        switchMap(() => {
          // Una vez que termine la creacion, obtener la lista actualizada
          return this.headerPageService.getModules();})
      ).subscribe({
        next: (response: any) => {
          this.modules = response;
          this.toggleAddCell()
          for (const module of this.modules) {
            if (module.name == this.quizCategory.module)
              this.cells = module.cell
          }
          
        },
        error: (error) => {
          console.error('Error al crear la célula', error);
          // Manejar error (mostrar mensaje al usuario)
        }
      });
    }
  }
  // Método para iniciar la edición
  startEditingCell(event: Event, cellId: string, currentName: string) {
    event.stopPropagation();
    this.editingCellId = cellId;
    this.editCellControl.setValue(currentName);
  }
  // Método para guardar los cambios
  saveCellEdit(cellId: string) {
    if (this.editCellControl.valid) {
      const newName = this.editCellControl.value;
      this.headerPageService.updateCell(cellId, newName).pipe(
        switchMap(() => {
          // Una vez que termine la creacion, obtener la lista actualizada
          return this.headerPageService.getModules();})
      ).subscribe({
        next: (response: any) => {
          this.modules = response;
          for (const module of this.modules) {
            if (module.name == this.quizCategory.module)
              this.cells = module.cell
          }
          this.editingCellId = null;
          this.editCellControl.reset();
        },
        error: (error) => {
          console.error('Error al actualizar la célula', error);
          // Manejar error (mostrar mensaje al usuario)
        }
      });
    }
  }

  // Método para cancelar la edición
  cancelEditingCell() {
    this.editingCellId = null;
    this.editCellControl.reset();
  }
  
  //elimina un modulo
  deleteCell(id: string) {
    this.headerPageService.deleteCell(id).pipe(
      // Esperar a que termine el delete
      switchMap(() => {
        // Una vez que termine el delete, obtener la lista actualizada
        return this.headerPageService.getModules();
      })
    ).subscribe({
      next: (response: any) => {
        this.modules = response;
        for (const module of this.modules) {
          if (module.name == this.quizCategory.module)
            this.cells = module.cell
        }
      }
    });
  }
  //Escucha los click del mouse en el documento
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    // Verifica si el clic fue fuera de los contenedores
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    
    if (!clickedInside) {
      this.showModulo = false;
      this.showCelula = false;
      this.showSeniority = false;
    }
  }
  //Cambia la visibilidad de modulo, celula y seniority
  isShowModulo(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.showModulo = !this.showModulo;
    if (this.showModulo){
      this.showCelula = false;
      this.showSeniority = false;
    }
  }
  isShowCelula(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.showCelula = !this.showCelula;
    if (this.showCelula){
      this.showSeniority = false;
      this.showModulo = false;
    }
  }
  isShowSeniority(event?: MouseEvent) {
    if (event) {
      event.stopPropagation();
    }
    this.showSeniority = !this.showSeniority;
    if (this.showSeniority){
      this.showCelula = false;
      this.showModulo = false;
    }
  }
  //Cambia la visibilidad del input modulo para agregar uno nuevo en el modo edit
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
