import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllPageComponent } from './pages/all-page/all-page.component';
import { AllRoutingModule } from './all-routing.module';
import { FormsModule } from '@angular/forms';
import { HeaderFormModule } from 'src/app/shared/components/header-form/header-form.module';
import { EditModule } from '../edit/edit.module';
@NgModule({
  declarations: [AllPageComponent],
  imports: [CommonModule, AllRoutingModule, FormsModule, HeaderFormModule,EditModule],
  exports: [AllPageComponent]
})
export class AllModule {}


