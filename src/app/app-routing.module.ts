import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthPageComponent } from './modules/auth/pages/register/auth-page.component';
import { SignUpComponent } from './modules/candidato-sign-up/pages/sign-up.component';
import { HomePageComponent } from './modules/home/pages/home-page/home-page.component';
import { AuthGuard } from '@auth0/auth0-angular';
import { RoleGuard } from '../app/modules/guards/role.guard';
import { WelcomeCandidatoComponent } from './modules/welcome-candidato/welcome-candidato.component';
import { DashboardPageComponent } from './modules/candidato-dashboard/dashboard-page/dashboard-page.component';
import { LoginComponent } from './modules/auth/pages/login/login.component';
import { authenticatedGuard} from './modules/guards/authenticated.guard';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
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
          canActivate: [AuthGuard],
          loadChildren: () =>
            import('./modules/welcome-candidato/welcome-candidato.module').then(m => m.WelcomeCandidatoModule),
        },
        {
          path: 'dashboard',
          canActivate: [AuthGuard],
          component: DashboardPageComponent,
          
          loadChildren: () =>
            import(
              './modules/candidato-dashboard/candidato-dashboard.module'
            ).then(m => m.CandidatoDashboardModule),
        },
        {
          path: 'register',
          canActivate: [authenticatedGuard], // Si esta autenticado lo redirige a home o candidato segun su rol
          component: AuthPageComponent,
        },
        {
          path: 'sign-up',
          canActivate: [authenticatedGuard], // Si esta autenticado lo redirige a home o candidato segun su rol
          component: SignUpComponent,
        },
        {
          path: 'login',
          canActivate: [authenticatedGuard], // Si esta autenticado lo redirige a home o candidato segun su rol
          component: LoginComponent,
        },
        {
          path: 'forgot-password',
          canActivate: [authenticatedGuard], // Si esta autenticado lo redirige a home o candidato segun su rol
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
