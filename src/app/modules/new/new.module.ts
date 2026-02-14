import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewPagesComponent } from './pages/new-pages/new-pages.component';
import { NewRoutingModule } from './new-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { HeaderFormModule } from 'src/app/shared/components/header-form/header-form.module';
import { QuestionComponent } from 'src/app/shared/question/question.component';

@NgModule({
  declarations: [NewPagesComponent],
  imports: [
    CommonModule,
    NewRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HeaderFormModule,
    QuestionComponent,
  ],
  exports: [NewPagesComponent],
})
export class NewModule {}
