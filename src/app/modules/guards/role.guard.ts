import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoleGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.auth.user$.pipe(
      map(user => {
        const roles = user['https://miaplicacion.com/roles']; 
        return roles && roles.includes('admin'); 
      }),
      tap(hasAccess => {
        if (!hasAccess) {
          this.router.navigate(['/sign-in']); // Redirigir si no tiene acceso
        }
      })
    );
  }
}
