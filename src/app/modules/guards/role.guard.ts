import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { LocalAuthService } from '../auth/local-auth.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, 
    private router: Router,
    private localAuthService: LocalAuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.auth.user$.pipe(
      map(user => {
        console.log('🔒 Verificando autenticación del usuario:', user);
        if (!user) {
          user = this.localAuthService.getUser();
        }
        const roles = user?.['https://miaplicacion.com/roles'] || [];
        console.log('🔒 Verificando roles del usuario:', roles);
        return roles && roles.includes('admin'); 
      }),
      tap(hasAccess => {
        if (!hasAccess) {
          this.router.navigate(['/candidato']); // Redirigir si no tiene acceso
        }
      })
    );
  }
}
