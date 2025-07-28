import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { switchMap, tap. map } from 'rxjs';

export const authenticatedGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated$.pipe(
    switchMap(isAuthenticated => {
      if (isAuthenticated) {
        // Si está autenticado, obtener usuario para verificar roles
        return auth.user$.pipe(
          tap(user => {
            if (user) {
              console.log('✅ Usuario ya autenticado:', user.name || user.email);
              const roles = user['https://miaplicacion.com/roles'] || [];
              console.log('🎭 Roles del usuario:', roles);
              
              if (roles.includes('admin')) {
                router.navigate(['/home']);
              } else {                
                router.navigate(['/candidato']);
              }
            } 
          }),
          map(() => false) // No permitir acceso a login/register
        );
      } else {
        // No está autenticado, permitir acceso a login/register
        console.log('🔓 Usuario no autenticado, permitiendo acceso a:', state.url);
        return [true];
      }
    })
  );
};