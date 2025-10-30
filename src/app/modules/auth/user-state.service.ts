import { Injectable } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';

/**
 * Este servicio gestiona y unifica el estado del usuario, permitiendo que
 * la aplicación funcione tanto con la sesión de Auth0 como con la sesión
 * de JWT local generada por el backend.
 */
@Injectable({ providedIn: 'root' })
export class UserStateService {
  // 1. Fuente para usuarios autenticados vía Auth0
  private auth0User$: Observable<User | undefined> = this.auth.user$;

  // 2. Fuente para usuarios autenticados vía JWT Local (manejada manualmente)
  // Se usa 'any' porque el payload del JWT local puede no coincidir con el tipo 'User' de Auth0.
  private localUserSubject = new BehaviorSubject<any>(null);

  /**
   * 3. Observable Unificado: Combina ambas fuentes.
   * Da prioridad a la sesión de Auth0 (si existe), y si no, usa la sesión local.
   */
  public unifiedUser$: Observable<any> = combineLatest([
    this.auth0User$,
    this.localUserSubject.asObservable(),
  ]).pipe(
    map(([auth0User, localUser]) => auth0User || localUser) // Retorna el objeto de usuario con datos
  );

  constructor(private auth: AuthService) {}

  /**
   * Método a llamar después de un login-local exitoso.
   * Permite inyectar los datos del usuario extraídos del JWT local.
   * @param userData Los datos del usuario (email, name, picture, etc.)
   */
  setLocalUser(userData: { name: string; email: string; picture?: string; [key: string]: any }) {
    // Asegúrate de que el objeto local tenga las propiedades que espera el dashboard (name, picture)
    this.localUserSubject.next(userData);
  }

  /**
   * Limpia el estado del usuario local (útil durante el logout).
   */
  clearLocalUser() {
    this.localUserSubject.next(null);
  }
}