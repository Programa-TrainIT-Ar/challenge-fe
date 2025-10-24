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

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // 1. INTENTO LOCAL (SÍNCRONO): Verificar el token local primero.
    const localToken = this.localAuth.getToken();

    if (localToken) {
      // Si hay un token local (login con email), se adjunta inmediatamente.
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${localToken}` },
      });
      return next.handle(authReq);
    }

    // 2. INTENTO AUTH0 (ASÍNCRONO): Si no hay token local, se consulta Auth0.
    return this.auth.getAccessTokenSilently({ detailedResponse: true }).pipe(
      switchMap((tokenResponse: any) => {
        let auth0Token: string | null = null;

        if (tokenResponse && tokenResponse.access_token) {
          auth0Token = tokenResponse.access_token;
        }

        if (auth0Token) {
          // Si Auth0 devuelve un token
          const authReq = req.clone({
            setHeaders: { Authorization: `Bearer ${auth0Token}` },
          });
          return next.handle(authReq);
        }

        // Si Auth0 falla (no hay sesión, catchError lo maneja implícitamente aquí),
        // el flujo continúa al catchError de abajo.
        return next.handle(req); // Nunca debería ejecutarse si hay un catchError.
      }),
      catchError(() => {
        // Si el intento asíncrono de Auth0 falla, simplemente se devuelve la solicitud original.
        return next.handle(req);
      })
    );
  }
}
