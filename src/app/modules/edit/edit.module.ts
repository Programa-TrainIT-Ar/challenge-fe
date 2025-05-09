import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderFormModule } from 'src/app/shared/components/header-form/header-form.module';
import { EditRoutingModule } from './edit-routing.module';
import { EditPagesComponent } from './pages/edit-pages/edit-pages.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [EditPagesComponent],
  imports: [CommonModule, EditRoutingModule, HeaderFormModule,FormsModule,ReactiveFormsModule],
  exports: [EditPagesComponent],
})
export class EditModule {}
