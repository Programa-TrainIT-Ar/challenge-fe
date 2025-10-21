import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizTakeComponent } from './pages/quiz-take/quiz-take.component';
import { QuizResultComponent } from './pages/quiz-result/quiz-result.component';

const routes: Routes = [
  {path: 'result', component: QuizResultComponent},
  { path: ':id', component: QuizTakeComponent },
  
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuizRoutingModule { }
