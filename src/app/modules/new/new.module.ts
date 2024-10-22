import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPagesComponent } from './pages/new-pages/new-pages.component';
import { NewRoutingModule } from './new-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { HeaderFormModule } from 'src/app/shared/components/header-form/header-form.module';

@NgModule({
  declarations: [NewPagesComponent],
  imports: [
    CommonModule,
    NewRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HeaderFormModule,
  ],
  exports: [NewPagesComponent],
})
export class NewModule {}
