import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HeaderFormRoutingModule } from './header-form-routing.module';
import { HeaderPageComponent } from './pages/header-page/header-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [HeaderPageComponent],
  imports: [
    CommonModule,
    HeaderFormRoutingModule, 
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    HeaderPageComponent
  ]
})
export class HeaderFormModule { }
