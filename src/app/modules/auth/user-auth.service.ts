// src/app/shared/services/user-auth.service.ts
import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UserService, FindUserResponse } from '../../modules/auth/pages/user.service';
import { Router } from '@angular/router';
import { AlertService } from '../../shared/components/alert/alert.service';
import { BehaviorSubject, firstValueFrom, filter, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  private currentUserIdSubject = new BehaviorSubject<string | null>(null);
  private currentUserSubject = new BehaviorSubject<FindUserResponse | null>(null);
  
  public currentUserId$ = this.currentUserIdSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private auth: AuthService,
    private userService: UserService, // Reutilizar el servicio existente
    private router: Router,
    private alertService: AlertService
  ) {}

  /**
   * Obtiene el ID del usuario actual de manera segura
   */
  async getCurrentUserId(): Promise<string | null> {
    // Si ya tenemos el ID en cache, devolverlo
    if (this.currentUserIdSubject.value) {
      return this.currentUserIdSubject.value;
    }

    try {
      const userResponse = await this.loadCurrentUser();
      return userResponse?.user?.id || null;
    } catch (error) {
      console.error('❌ Error obteniendo ID de usuario:', error);
      return null;
    }
  }

  /**
   * Carga el usuario completo desde Auth0 y la BD
   */
  async loadCurrentUser(): Promise<FindUserResponse | null> {
    try {
      // Obtener usuario de Auth0
      const authUser = await firstValueFrom(
        this.auth.user$.pipe(
          filter(user => !!user && !!user.email)
        )
      );

      if (!authUser?.email) {
        throw new Error('Usuario no autenticado en Auth0');
      }

      console.log('👤 Usuario Auth0:', authUser.email);

      // Buscar en base de datos usando el servicio existente
      const dbUserResponse = await firstValueFrom(
        this.userService.finduserByEmail(authUser.email).pipe(
          catchError(error => {
            console.error('Error buscando usuario en BD:', error);
            return of(null);
          })
        )
      );

      if (!dbUserResponse?.user?.id) {
        throw new Error('Usuario no encontrado en BD');
      }

      // Cachear los datos
      this.currentUserSubject.next(dbUserResponse);
      this.currentUserIdSubject.next(dbUserResponse.user.id);

      console.log('✅ Usuario cargado exitosamente:', dbUserResponse.user.id);
      return dbUserResponse;

    } catch (error) {
      console.error('❌ Error cargando usuario:', error);
      this.handleAuthError();
      return null;
    }
  }

  /**
   * Maneja errores de autenticación
   */
  private handleAuthError(): void {
    this.alertService.showConfirm(
      'Sesión Expirada',
      'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
      () => this.redirectToLogin(),
      'Ir al Login'
    );
  }

  /**
   * Redirige al login y limpia el estado
   */
  private redirectToLogin(): void {
    localStorage.clear();
    sessionStorage.clear();
    this.clearUser();
    this.router.navigate(['/auth/login']); // Usar la ruta correcta de tu app
  }

  /**
   * Limpia el estado del usuario
   */
  clearUser(): void {
    this.currentUserIdSubject.next(null);
    this.currentUserSubject.next(null);
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return this.currentUserIdSubject.value !== null;
  }

  /**
   * Obtiene el usuario completo (con register_complete)
   */
  getCurrentUser(): FindUserResponse | null {
    return this.currentUserSubject.value;
  }
}