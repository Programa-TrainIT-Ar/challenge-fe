import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable, from, of } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { LocalAuthService } from './local-auth.service';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private localAuth: LocalAuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Intentamos primero con Auth0
    return this.auth.getAccessTokenSilently({ detailedResponse: true }).pipe(
      catchError(() => of(null)), // Si falla (ej: login con email), devolvemos null
      switchMap((tokenResponse: any) => {
        let token: string | null = null;

        if (tokenResponse && tokenResponse.access_token) {
          // Caso Auth0
          token = tokenResponse.access_token;
        } else {
          // Caso login con email/local
          token = this.localAuth.getToken();
        }

        if (token) {
          const authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` },
          });
          return next.handle(authReq);
        }

        // Si no hay token seguimos normal
        return next.handle(req);
      })
    );
  }
}
