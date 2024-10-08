import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AllPageComponent } from './pages/all-page/all-page.component';
import { AllRoutingModule } from './all-routing.module';

@NgModule({
  declarations: [AllPageComponent],
  imports: [CommonModule, AllRoutingModule],
  exports: [AllPageComponent]
})
export class AllModule {}
