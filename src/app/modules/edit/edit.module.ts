import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderFormModule } from 'src/app/shared/components/header-form/header-form.module';
import { EditRoutingModule } from './edit-routing.module';
import { EditPagesComponent } from './pages/edit-pages/edit-pages.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { EditQuestionPopUpComponent } from './pages/edit-pages/edit-question-pop-up/edit-question-pop-up.component';
import { TrueFalseQuestionComponent } from './pages/edit-pages/true-false-question/true-false-question.component';
import { ChoiceQuestionComponent } from './pages/edit-pages/choise-question/choice-question.component';
import { QuestionComponent } from './pages/edit-pages/question/question.component';


@NgModule({
  declarations: [EditPagesComponent],
  imports: [
    CommonModule,
    EditRoutingModule,
    HeaderFormModule,
    FormsModule,
    ReactiveFormsModule,
    EditQuestionPopUpComponent,
    TrueFalseQuestionComponent,
    ChoiceQuestionComponent,
    QuestionComponent,
  ],
  exports: [EditPagesComponent],
})
export class EditModule {}
