import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthPageComponent } from './modules/auth/pages/sign-up/signup-page.component';
import { AccountSetupComponent } from './modules/auth/pages/account-setup/pages/account-setup.component';
import { HomePageComponent } from './modules/home/pages/home-page/home-page.component';
import { AuthGuard } from '../app/modules/guards/authGuard.guard';
import { RoleGuard } from '../app/modules/guards/role.guard';
import { WelcomeCandidatoComponent } from './modules/welcome-candidato/welcome-candidato.component';
import { DashboardPageComponent } from './modules/candidato-dashboard/dashboard-mainpage/dashboard-page.component';
import { LoginComponent } from './modules/auth/pages/login/login.component';
import { authenticatedGuard } from './modules/guards/authenticated.guard';
import { ErrorComponent } from './modules/home/pages/error/error.component';

import { VerifyEmailComponent } from './modules/auth/pages/verify-email/verify-email.component';
import { CandidatoFormComponent } from './modules/candidato-dashboard/candidato-form/candidato-form.component';
import { QuizTakeComponent } from './modules/quiz/pages/quiz-take/quiz-take.component';
import { ResetPasswordComponent } from './modules/auth/pages/reset-password/reset-password.component';
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
          path: '',
          redirectTo: 'login',
          pathMatch: 'full',
        },
        {
          path: 'candidato',
          component: WelcomeCandidatoComponent,
          canActivate: [AuthGuard],
          loadChildren: () =>
            import('./modules/welcome-candidato/welcome-candidato.module').then(
              m => m.WelcomeCandidatoModule
            ),
        },
        {
          path: 'quiz',
          canActivate: [AuthGuard],
          loadChildren: () =>
            import('./modules/quiz/quiz.module').then(m => m.QuizModule),
        },
        {
          path: 'quiz/:id',
          canActivate: [AuthGuard],
          loadChildren: () =>
            import('./modules/quiz/pages/quiz-take/quiz-take.component').then(m => m.QuizTakeComponent),
        },
        {
          path: 'dashboard',
          canActivate: [AuthGuard],
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
          path: 'account-setup',
          //canActivate: [authenticatedGuard],
          component: AccountSetupComponent,
        },
        {
          path: 'login',
          canActivate: [authenticatedGuard], // Si esta autenticado lo redirige a home o candidato segun su rol
          component: LoginComponent,
        },
        {
          path: 'complete-profile',
          canActivate: [AuthGuard],
          component: CandidatoFormComponent,
        },
        {
          path: 'verify-email',
          component: VerifyEmailComponent,
        },
        {
          path: 'forgot-password',
          canActivate: [authenticatedGuard], // Si esta autenticado lo redirige a home o candidato segun su rol
          loadComponent: () =>
            import(
              './modules/auth/pages/forgot-password/forgot-password.component'
            ).then(m => m.ForgotPasswordComponent),
        },
        {
          path: 'reset-password',
          component: ResetPasswordComponent,
        },
        {
          path: '**',
          component: ErrorComponent,
          pathMatch: 'full',
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
