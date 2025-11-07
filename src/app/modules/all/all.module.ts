import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllPageComponent } from './pages/all-page/all-page.component';
import { ViewQuizComponent } from './pages/view-quiz/view-quiz.component';
import { AllRoutingModule } from './all-routing.module';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderFormModule } from 'src/app/shared/components/header-form/header-form.module';
import { EditModule } from '../edit/edit.module';
import { EditPagesComponent } from '../edit/pages/edit-pages/edit-pages.component';
import { LoaderComponent } from "src/app/shared/loader/loader.component";

const routes: Routes = [
  {
    path: 'view-quiz/:id', // Define la ruta con el parámetro 'id'
    component: ViewQuizComponent,
  },
  {
    path: 'edit-pages/:id', // Define la ruta con el parámetro 'id'
    component: EditPagesComponent,
  },
  // {
  //   path: 'candidato', // Define la ruta para /candidato
  //   loadChildren: () =>
  //     import('../candidato-dashboard/candidato-dashboard.module').then(
  //       (m) => m.CandidatoDashboardModule
  //     ),
  // },
];

@NgModule({
  declarations: [
    AllPageComponent,
    ViewQuizComponent,
  ],
  imports: [
    CommonModule,
    AllRoutingModule,
    FormsModule,
    HeaderFormModule,
    EditModule,
    RouterModule.forChild(routes),
    LoaderComponent
],
  exports: [
    AllPageComponent,
    ViewQuizComponent,
  ],
})
export class AllModule {}
