import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { NewPagesComponent } from '../new/pages/new-pages/new-pages.component';
import { EditPagesComponent } from '../edit/pages/edit-pages/edit-pages.component';
import { AllPageComponent } from '../all/pages/all-page/all-page.component';

const routes: Routes = [
  { path: '', component: WelcomePageComponent },
  { path: 'create', component: NewPagesComponent },
  { path: 'edit', component: EditPagesComponent },
  { path: 'all', component: AllPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeRoutingModule {}
