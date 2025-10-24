import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { QuizRoutingModule } from './quiz-routing.module';
import { QuizTakeComponent } from './pages/quiz-take/quiz-take.component';

// Importa tus componentes compartidos
import { SharedModule } from "../../shared/shared.module";
import { QuestionContainerComponent } from "../../shared/question-container/question-container.component";
import { BlueButtonComponent } from 'src/app/shared/components/blue-button/blue-button.component';
import { QuizResultComponent } from './pages/quiz-result/quiz-result.component';


@NgModule({
  imports: [
    CommonModule,
    QuizRoutingModule,
    ReactiveFormsModule,
    QuestionContainerComponent,
    SharedModule,
    BlueButtonComponent,
    QuizTakeComponent,
    QuizResultComponent
  ]
})
export class QuizModule { }
