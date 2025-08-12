import { AuthService} from '@auth0/auth0-angular';
import { tap, map, } from 'rxjs';
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
      
  export const authenticatedGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated$.pipe(
    tap(isAuthenticated => {
      console.log('🔒 Verificando autenticación del usuario:', isAuthenticated);
      if (isAuthenticated) {
        console.log('✅ Usuario ya autenticado, redirigiendo a home');
        router.navigate(['/home']);
      } else {
        console.log('🔓 Usuario no autenticado, permitiendo acceso a la ruta');
      }
    }),
    map(isAuthenticated => !isAuthenticated) // Permitir acceso solo si no está autenticado
  )
};