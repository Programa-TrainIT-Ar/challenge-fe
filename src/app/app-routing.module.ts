import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthPageComponent } from './modules/auth/pages/register/auth-page.component';
import { SignUpComponent } from './modules/candidato-sign-up/pages/sign-up.component';
import { HomePageComponent } from './modules/home/pages/home-page/home-page.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { RoleGuard } from '../app/modules/guards/role.guard'; // Importa el guardia de roles
import { EditPagesComponent } from './modules/edit/pages/edit-pages/edit-pages.component';
import { WelcomeCandidatoComponent } from './modules/welcome-candidato/welcome-candidato.component';
import { CandidatoDashboardModule } from './modules/candidato-dashboard/candidato-dashboard.module';
import { DashboardPageComponent } from './modules/candidato-dashboard/dashboard-page/dashboard-page.component';
import { LoginComponent } from './modules/auth/pages/login/login.component';
import { CallbackComponent } from './modules/auth/pages/callback/callback.component';
@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'callback',
          component: CallbackComponent
        },
        {
          path: 'home',
          component: HomePageComponent,
          canActivate: [AuthGuard, RoleGuard],
          data: { expectedRole: 'admin' },
          loadChildren: () =>
            import('./modules/home/home.module').then(m => m.HomeModule),
        },
        {
          path: 'candidato',
          component: WelcomeCandidatoComponent,
          canActivate: [AuthGuard ],
          loadChildren: () =>
            import('./modules/welcome-candidato/welcome-candidato.module').then(m => m.WelcomeCandidatoModule),
        },
        {
          path: 'dashboard', // Define la ruta para /candidato
          component: DashboardPageComponent,
          
          loadChildren: () =>
            import(
              './modules/candidato-dashboard/candidato-dashboard.module'
            ).then(m => m.CandidatoDashboardModule),
        },
        {
          path: 'register',
          component: AuthPageComponent,
        },
        {
          path: 'sign-up',
          component: SignUpComponent,
        },
        {
          path: 'login',
          component: LoginComponent,
        },
        {
          path: 'forgot-password',
          loadComponent: () =>
            import('./modules/auth/pages/forgot-password/forgot-password.component').then(
              m => m.ForgotPasswordComponent
            ),
        },
        {
          path: '**',
          redirectTo: 'register',
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
