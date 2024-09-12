import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthPageComponent } from './modules/auth/pages/auth-page/auth-page.component';

import { AdminGestionQuizzComponent } from './modules/admin-gestion-quiz/admin-gestion-quizz.component';

import { AuthSignInPageComponent } from './modules/auth-sign-in/pages/auth-sign-in-page/auth-sign-in-page.component';
import { HomePageComponent } from './modules/home/pages/home-page/home-page.component';

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: '',
          component: AppLayoutComponent,
          children: [
            {
              path: '',
              loadChildren: () =>
                import('./demo/components/dashboard/routes').then(
                  m => m.DASHBOARD_ROUTES
                ),
            },
          ],
        },
        {
          path: 'home',
          component: HomePageComponent,
          loadChildren: () =>
            import('./modules/home/home.module').then(m => m.HomeModule),
        },
        {
          path: 'login',
          component: AuthPageComponent,
        },
        {
          path: 'sign-in',
          component: AuthSignInPageComponent,
        },
        {
          path: '**',
          redirectTo: '/notfound',
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
