import { Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardPageComponent } from './dashboard-mainpage/dashboard-page.component';
import { CandidatoDashboardRoutingModule } from './candidato-dashboard-routing.module';
import { AllModule } from '../all/all.module';
import { SharedModule } from "src/app/shared/shared.module";
import { CandidatoFormComponent } from './candidato-form/candidato-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { ButtonModule } from 'primeng/button';

@NgModule({
  declarations: [
    CandidatoFormComponent,
  ],
  imports: [
    CommonModule,
    CandidatoDashboardRoutingModule, 
    SharedModule,
    AllModule,
    FormsModule,
    ReactiveFormsModule,
    DropdownModule,
    InputTextModule,
    MultiSelectModule,
    ButtonModule,
  ],
  exports: [
    CandidatoFormComponent,
  ],
})
export class CandidatoDashboardModule {}
