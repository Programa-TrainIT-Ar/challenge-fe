import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';

import {AppLayoutComponent} from "./layout/app.layout.component";

@NgModule({
    imports: [RouterModule.forRoot([{
        path: '', component: AppLayoutComponent, children: [{
            path: '',
            loadChildren: () => import('./demo/components/dashboard/dashboard.module').then(m => m.DashboardModule)
        }, {
            path: 'utilities',
            loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule)
        },]
    }, {
        path: '**', redirectTo: '/notfound'
    },], {scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload'})],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
