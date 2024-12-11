import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthPageComponent } from './modules/auth/pages/auth-page/auth-page.component';
import { AuthSignInPageComponent } from './modules/auth-sign-in/pages/auth-sign-in-page/auth-sign-in-page.component';
import { HomePageComponent } from './modules/home/pages/home-page/home-page.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { RoleGuard } from '../app/modules/guards/role.guard'; // Importa el guardia de roles
import { EditPagesComponent } from './modules/edit/pages/edit-pages/edit-pages.component';
import { CandidatoDashboardModule } from './modules/candidato-dashboard/candidato-dashboard.module';
@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'home',
          component: HomePageComponent,
          canActivate: [AuthGuard,RoleGuard],
          data: { expectedRole: 'admin' },
          loadChildren: () =>
            import('./modules/home/home.module').then(m => m.HomeModule),
        },
        // { path: 'edit', component: EditPagesComponent },
        // { path: 'edit/:name', component: EditPagesComponent },
        {
          path: 'candidato', // Define la ruta para /candidato
          loadChildren: () =>
            import('./modules/candidato-dashboard/candidato-dashboard.module').then(
              (m) => m.CandidatoDashboardModule
            ),
        },
        {
          path: '',
          component: AuthPageComponent,
          loadChildren: () =>
            import('./modules/auth/auth.module').then(m => m.AuthModule),
        },
        {
          path: 'sign-in',
          component: AuthSignInPageComponent,
        },
        {
          path: '**',
          redirectTo: '',
        },
      ],
      {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
        onSameUrlNavigation: 'reload',
      }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
