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
  // Clave para guardar el usuario local en localStorage
  private readonly LOCAL_USER_KEY = 'app_local_user';

  // 1. Fuente para usuarios autenticados vía Auth0
  private auth0User$: Observable<User | undefined> = this.auth.user$;

  // 2. Fuente para usuarios autenticados vía JWT Local
  // Se usa 'any' porque el payload del JWT local puede no coincidir con el tipo 'User' de Auth0.
  // Inicializa el BehaviorSubject recuperando el usuario local del localStorage
  private localUserSubject = new BehaviorSubject<any>(
    this.getInitialLocalUser()
  );
  public localUser$ = this.localUserSubject.asObservable();

/**
     * Combina el usuario de Auth0 con el ID de la DB si es que existe uno local.
     * Si hay sesión de Auth0 (auth0User), pero su registro en la BD local 
     * tiene el 'id', se inyecta en el objeto de Auth0.
     */
    private auth0UserWithLocalId$: Observable<any> = combineLatest([
        this.auth0User$,
        this.localUser$,
    ]).pipe(
        map(([auth0User, localUser]) => {
            // 1. Si hay una sesión de Auth0 activa
            if (auth0User) {
                // 2. Se busca el ID unificado ('id') en el objeto local guardado
                const dbId = localUser?.id; 
                
                // 3. Si se encuentra el ID de la DB, se añade al objeto de Auth0
                if (dbId) {
                    return {
                        ...auth0User,
                        // 1. Sobrescribir 'sub' con el UUID de la DB 
                        sub: dbId, 
                        // 2. Mantener la propiedad 'id' con el UUID de la DB (Para que se pueda realizar QUIZ)
                        id: dbId,
                    };
                }
                // Si la sesión de Auth0 existe, pero no se encuentra el ID local, 
                // Se devuelve el objeto de Auth0 sin enriquecer (esto es un fallo, pero defensivo)
                return auth0User; 
            }
            // Si no hay sesión de Auth0, se retorna null/undefined para que el unificado use el local
            return null;
        })
    );

  /**
   * 3. Observable Unificado: Combina ambas fuentes.
   * Da prioridad a la sesión de Auth0 (si existe), y si no, usa la sesión local.
   */
  public unifiedUser$: Observable<any> = combineLatest([
    this.auth0UserWithLocalId$, // Fuente 1: Usuario de Auth0 enriquecido
    this.localUser$,            // Fuente 2: Usuario local
  ]).pipe(
    map(([auth0UserWithLocalId, localUser]) => auth0UserWithLocalId || localUser) // Retorna el objeto de usuario con datos
  );

  constructor(private auth: AuthService) {}

  // Leer el usuario local del localStorage al iniciar el servicio.
  private getInitialLocalUser(): any {
    const storedUser = localStorage.getItem(this.LOCAL_USER_KEY);
    // Debe usar try/catch en caso de que los datos no sean JSON válidos
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error('Error al parsear el usuario del localStorage', e);
      localStorage.removeItem(this.LOCAL_USER_KEY); // Limpiar datos corruptos
      return null;
    }
  }

  /**
   * Método a llamar después de un login-local exitoso.
   * Permite inyectar los datos del usuario extraídos del JWT local.
   * @param userData Los datos del usuario (email, name, picture, etc.)
   */
  setLocalUser(userData: {
    name: string;
    email: string;
    picture?: string;
    sub?: string;
    [key: string]: any;
  }) {
    this.localUserSubject.next(userData);
    // Guardar el objeto completo en el localStorage
    localStorage.setItem(this.LOCAL_USER_KEY, JSON.stringify(userData));
  }

  /**
   * Limpia el estado del usuario local (durante el logout).
   * Actualiza el Subject y ELIMINA del localStorage.
   */
  clearLocalUser() {
    this.localUserSubject.next(null);
    // Eliminar la entrada del localStorage
    localStorage.removeItem(this.LOCAL_USER_KEY);
  }
}
