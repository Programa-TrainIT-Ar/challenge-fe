import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('../welcome/welcome.module').then(m => m.WelcomeModule),
  },
  {
    path: 'create',
    loadChildren: () => import('../new/new.module').then(m => m.NewModule),
  },
  {
    path: 'edit',
    loadChildren: () => import('../edit/edit.module').then(m => m.EditModule),
  },
  {
    path: 'all',
    loadChildren: () => import('../all/all.module').then(m => m.AllModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
