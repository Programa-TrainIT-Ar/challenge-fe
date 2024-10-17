import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllPageComponent } from './pages/all-page/all-page.component';
import { ViewQuizComponent } from './pages/view-quiz/view-quiz.component'; // Asegúrate de importar el componente
import { AllRoutingModule } from './all-routing.module';
import { FormsModule } from '@angular/forms';
import { HeaderFormModule } from 'src/app/shared/components/header-form/header-form.module';

@NgModule({
  declarations: [
    AllPageComponent,
    ViewQuizComponent // Asegúrate de declarar el componente aquí
  ],
  imports: [
    CommonModule,
    AllRoutingModule,
    FormsModule,
    HeaderFormModule
  ],
  exports: [
    AllPageComponent,
    ViewQuizComponent // Puedes exportar si es necesario
  ]
})
export class AllModule {}
