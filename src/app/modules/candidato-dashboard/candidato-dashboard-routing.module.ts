import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPageComponent } from './dashboard-mainpage/dashboard-page.component';
import { AllPageComponent } from '../all/pages/all-page/all-page.component';
import { DashboardCardsComponent } from './dashboard-cards/dashboard-cards.component';
import { DashboardQuizzesComponent } from './dashboard-quizzes/dashboard-quizzes.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardPageComponent, // Ruta principal del módulo
    children: [
      { path: '', redirectTo: 'cards', pathMatch: 'full' },
      { path: 'cards', component: DashboardCardsComponent },
      { path: 'quizzes', component: DashboardQuizzesComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Importa las rutas
  exports: [RouterModule], // Exporta el módulo de enrutamiento
})
export class CandidatoDashboardRoutingModule {}
