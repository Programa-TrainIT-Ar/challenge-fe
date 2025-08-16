import { AuthService} from '@auth0/auth0-angular';
import { tap, map, } from 'rxjs';
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { LocalAuthService } from '../auth/local-auth.service';
      
  export const authenticatedGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const localAuthService = inject(LocalAuthService);

  return auth.isAuthenticated$.pipe(
    tap(isAuth0 => {
      console.log('🔒 Verificando autenticación del usuario:', isAuth0);
      if (isAuth0 || localAuthService.isAuthenticated()) {
        console.log('✅ Usuario ya autenticado, redirigiendo a home');
        router.navigate(['/home']);
        return false
      } else {
        console.log('🔓 Usuario no autenticado, permitiendo acceso a la ruta');
        return true;
      }
    }),
    map(isAuthenticated => !isAuthenticated) // Permitir acceso solo si no está autenticado
  )
};