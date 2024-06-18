import { NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';

import { AuthModule } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    AppLayoutModule,
    AuthModule.forRoot(environment.auth)
],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
