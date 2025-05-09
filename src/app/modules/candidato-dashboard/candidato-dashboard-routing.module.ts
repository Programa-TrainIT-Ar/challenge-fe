import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardPageComponent } from './dashboard-page/dashboard-page.component';

const routes: Routes = [
  { path: '', component: DashboardPageComponent } // Ruta principal del módulo
];

@NgModule({
  imports: [RouterModule.forChild(routes)], // Importa las rutas
  exports: [RouterModule] // Exporta el módulo de enrutamiento
})
export class CandidatoDashboardRoutingModule {}
