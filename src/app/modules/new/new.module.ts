import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPagesComponent } from './pages/new-pages/new-pages.component';
import { NewRoutingModule } from './new-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [NewPagesComponent],
  imports: [CommonModule, NewRoutingModule,FormsModule, ReactiveFormsModule],
  exports: [NewPagesComponent],
})
export class NewModule {}
