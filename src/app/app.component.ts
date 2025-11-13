import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { UserService, UserData } from 'src/app/modules/auth/pages/user.service';
import { filter, switchMap, catchError, of, tap } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { UserStateService } from 'src/app/modules/auth/user-state.service';
import {
  UserAuthResponse,
  UserDB,
} from './modules/auth/interfaces/login-auth0.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(
    private primengConfig: PrimeNGConfig,
    private userService: UserService,
    private auth: AuthService,
    private userStateService: UserStateService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.auth.user$
      .pipe(
        filter(user => !!user && !!user.email),
        switchMap(user => {
          console.log('Buscando usuario Auth0 en BD local...');

          return this.userService.finduserByEmail(user.email!).pipe(
            switchMap(existingUser => {
              if (!existingUser) {
                console.log('➕ Usuario no encontrado, registrando...');
                return this.handleUserRegistration(user);
              } else {
                return of(existingUser);
              }
            })
          );
        })
      )
      .subscribe({
        next: (result: UserAuthResponse) => {
          const user: UserDB = result.user;

          // 1. Construir el nombre completo (si existe, si no, usar el email)
          const fullName =
            [user.first_name, user.last_name]
              .filter(Boolean) // Filtra nulos o vacíos
              .join(' ') || user.email;

          // 2. Construir el objeto con el campo 'name' requerido por UserStateService
          const userDataForState = {
            ...user, // Conserva todas las propiedades (incluyendo el ID crucial)
            name: fullName, // Añade o sobrescribe el campo 'name'
            picture: user.photo || undefined, // Mapea 'photo' a 'picture' (si es necesario)
          };

          // 3. Almacenar el objeto
          this.userStateService.setLocalUser(userDataForState);
        },
        error: error =>
          console.error('❌ Error al cargar usuario de la BD local:', error),
      });
  }

  private handleUserRegistration(user: any) {
    console.log('Nuevo usuario por Auth0, registrando en BD local...');

    const userData: UserData = {
      email: user.email,
      first_name: user.given_name || '',
      last_name: user.family_name || '',
      photo: user.picture || '',
      phone_number: user.phone_number || '',
      gender: user.gender || '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      birthdate: user.birthdate || new Date().toISOString().split('T')[0],
    };

    return this.userService.registerUserWithAuth(userData).pipe(
      catchError(error => {
        console.error('❌ Error al registrar usuario:', error);
        throw error;
      })
    );
  }
}
