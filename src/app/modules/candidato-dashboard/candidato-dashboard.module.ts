import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardPageComponent } from './dashboard-mainpage/dashboard-page.component';
import { CandidatoDashboardRoutingModule } from './candidato-dashboard-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { AllModule } from '../all/all.module';

@NgModule({
  declarations: [
    DashboardPageComponent, // Declara el componente
  ],
  imports: [
    CommonModule,
    CandidatoDashboardRoutingModule, // Importa el módulo de enrutamiento
    SharedModule,
    AllModule,
  ],
  exports: [
    DashboardPageComponent, // Exporta el componente para que sea reutilizable
  ],
})
export class CandidatoDashboardModule {}
