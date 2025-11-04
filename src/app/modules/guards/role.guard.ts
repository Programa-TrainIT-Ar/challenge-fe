import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { UserStateService } from '../auth/user-state.service';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  // Claim de roles que usas en el backend y Auth0 (CUSTOM CLAIM)
  private readonly ROLES_CLAIM = 'https://miaplicacion.com/roles';

  constructor(
    private auth: AuthService,
    private router: Router,
    private userStateService: UserStateService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.userStateService.unifiedUser$.pipe(
      take(1),
      map(user => {
        // 1. Verificar si hay usuario logueado

        if (!user) {
          console.log('🔒 Acceso denegado: Usuario no logueado.');
          this.router.navigate(['/login']);
          return false;
        }

        // 2. Extraer roles
        const roles: string[] = user[this.ROLES_CLAIM] || [];
        const requiredRole = 'admin'; // Asumimos que este Guard protege rutas de admin

        const hasAccess = roles.includes(requiredRole);

        console.log(
          `🔒 Verificando acceso para rol '${requiredRole}': ${hasAccess}`
        );

        return hasAccess;
      }),
      tap(hasAccess => {
        // 3. Redirección si el usuario NO es admin
        if (!hasAccess) {
          // El usuario está logueado, pero no tiene el rol necesario.
          // Redirigir a su dashboard (candidato) para evitar bucles.
          this.router.navigate(['/dashboard']);
        }
      })
    );
  }
}
