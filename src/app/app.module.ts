import { NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModule } from '@auth0/auth0-angular';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { SignUpModule } from './modules/candidato-sign-up/sign-up.module';

@NgModule({
    declarations: [AppComponent],
    imports: [
        AppRoutingModule,
        BrowserModule,
        CommonModule,
        AppLayoutModule,
        HttpClientModule,
        BrowserAnimationsModule,
        SignUpModule,
        AuthModule.forRoot({
            domain: environment.auth.domain,
            clientId: environment.auth.clientId,
            authorizationParams: {
                audience: environment.auth.authorizationParams.audience,
                redirect_uri: environment.auth.authorizationParams.redirect_uri,
            },
        }),
    ],
    providers: [
        {
            provide: LocationStrategy,
            useClass: PathLocationStrategy,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
