import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { QuestionContainerComponent } from 'src/app/shared/question-container/question-container.component';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    QuestionContainerComponent
  ]
})
export class WelcomeCandidatoModule { }
