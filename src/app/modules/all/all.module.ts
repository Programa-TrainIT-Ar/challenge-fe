import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllPageComponent } from './pages/all-page/all-page.component';
import { ViewQuizComponent } from './pages/view-quiz/view-quiz.component'; // Asegúrate de importar el componente
import { AllRoutingModule } from './all-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderFormModule } from 'src/app/shared/components/header-form/header-form.module';
import { EditModule } from '../edit/edit.module';


const routes: Routes = [
  {
    path: 'view-quiz/:id', // Define la ruta con el parámetro 'id'
    component: ViewQuizComponent
  },
];

@NgModule({
  declarations: [
    AllPageComponent,
    ViewQuizComponent // Asegúrate de declarar el componente aquí
  ],
  imports: [
    CommonModule,
    AllRoutingModule,
    FormsModule,
    HeaderFormModule,
    EditModule,
    RouterModule.forChild(routes) // Cambia forRoot por forChild
  ],
  exports: [
    AllPageComponent,
    ViewQuizComponent // Puedes exportar si es necesario
  ]
})
export class AllModule {}
