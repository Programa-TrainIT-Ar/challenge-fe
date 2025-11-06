import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { UserStateService } from './user-state.service';

@Injectable({ providedIn: 'root' })
export class LocalAuthService {
  private tokenKey = 'access_token';

  private userStateService = inject(UserStateService);

  // Custom Claim para roles que espera el RoleGuard y el UserStateService
  private readonly ROLES_CLAIM = 'https://miaplicacion.com/roles';
  // Asume que el claim de rol en tu JWT local se llama 'role'
  private readonly LOCAL_ROLE_PROPERTY = 'role';

  setToken(token: string) {
    localStorage.setItem(this.tokenKey, token);

    try {
      const decodedUser: any = jwtDecode(token);

      // 1. Obtener el rol del token JWT local (asumiendo que se llama 'role')
      const localRole = decodedUser[this.LOCAL_ROLE_PROPERTY] || 'candidato';

      // Asegurar que el rol sea un array de strings para compatibilidad con Auth0 y RoleGuard
      const rolesArray = Array.isArray(localRole) ? localRole : [localRole];

      // Se mapea el payload del JWT a las propiedades esperadas por el dashboard
      const userData = {
        name: decodedUser.first_name || decodedUser.email,
        email: decodedUser.email,
        sub: decodedUser.sub,
        // Se incluye cualquier otra propiedad necesaria (ej: picture, role)
        picture: decodedUser.picture,

        // 2. ¡EL CAMBIO CLAVE! Incluir el claim de rol con el nombre COMPLETO que espera el RoleGuard
        [this.ROLES_CLAIM]: rolesArray, // Esto se convierte en 'https://miaplicacion.com/roles': ['admin']
      };

      this.userStateService.setLocalUser(userData);
    } catch (e) {
      console.error('Error al decodificar o establecer el usuario local:', e);
      // Opcional: limpiar token si la decodificación falla
      this.clearToken();
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  clearToken() {
    localStorage.removeItem(this.tokenKey);
    // Notificar al UserStateService sobre el logout
    this.userStateService.clearLocalUser();
  }

  getUser(): any {
    // Por ahora debe ser any, hasta que se adapte el login (falta el rol del usuario en la estrategia jwt)
    const token = this.getToken();
    return token ? jwtDecode(token) : null;
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp > now;
    } catch {
      return false;
    }
  }
}
