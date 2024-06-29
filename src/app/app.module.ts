import { NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { AuthService } from '@auth0/auth0-angular';

import { AuthModule } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    AppLayoutModule,
    HttpClientModule,
    AuthModule.forRoot({
        domain: environment.auth.domain,
        clientId: environment.auth.clientId,
        authorizationParams: {
          audience: environment.auth.authorizationParams.audience,
          redirect_uri: environment.auth.authorizationParams.redirect_uri,
        }})
],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,

    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
