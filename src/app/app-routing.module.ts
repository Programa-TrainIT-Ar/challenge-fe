import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthPageComponent } from './modules/auth/pages/auth-page/auth-page.component';

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
        },{
          path:'login',
          component: AuthPageComponent
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
