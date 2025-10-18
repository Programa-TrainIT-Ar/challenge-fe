import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizTakeComponent } from './pages/quiz-take/quiz-take.component';
import { UnsavedChangesGuard } from './pages/quiz-take/unsaved-changes.guard';

const routes: Routes = [
  { path: ':id', component: QuizTakeComponent, canDeactivate: [UnsavedChangesGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuizRoutingModule { }
