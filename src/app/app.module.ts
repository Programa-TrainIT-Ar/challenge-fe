import { LOCALE_ID, NgModule } from '@angular/core';
import {
  LocationStrategy,
  PathLocationStrategy,
  registerLocaleData,
} from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AuthInterceptor } from './modules/auth/auth.interceptor';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs); //Permite mostrar las meses en español en las fechas
@NgModule({
  declarations: [AppComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    AppLayoutModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AuthModule.forRoot({
      domain: environment.auth.domain,
      clientId: environment.auth.clientId,
      authorizationParams: {
        audience: environment.auth.authorizationParams.audience,
        redirect_uri: environment.auth.authorizationParams.redirect_uri,
      },
      cacheLocation: 'localstorage', // Cambiar a 'localstorage' para persistencia entre recargas
      //useRefreshTokens: true, // Habilitar el uso de tokens de actualización
    }),
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true, // MUY importante para que Angular soporte varios interceptores
    },
    { provide: LOCALE_ID, useValue: 'es' }, //Permite mostrar los meses en español en las fechas
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
