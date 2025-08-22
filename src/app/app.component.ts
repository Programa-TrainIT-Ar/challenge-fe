import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { UserService, UserData } from 'src/app/modules/auth/pages/user.service';
import { filter, switchMap, catchError, of, tap } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(
    private primengConfig: PrimeNGConfig,
    private userService: UserService,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.auth.user$.pipe(
          filter(user => !!user && !!user.email),
          tap(user => console.log('👤 Usuario autenticado:', user)),
          switchMap(user => {
            console.log('🔍 Verificando si usuario existe...');
            return this.userService.finduserByEmail(user.email!).pipe(
              switchMap(existingUser => {
                if (!existingUser) {
                  console.log('➕ Usuario no encontrado, registrando...');
                  return this.handleUserRegistration(user);
                } else {
                  console.log('✅ Usuario encontrado:', existingUser);
                  return of(existingUser);
                }
              })
            );
          })
        ).subscribe({
          next: (result) => {
            console.log('🎉 Proceso completado:', result);
            
          },
          error: (error) => console.error('❌ Error:', error)
        });
  }
  
  private handleUserRegistration(user: any) {
    console.log('New user, registering...');
    
    const userData: UserData = {
      email: user.email,
      first_name: user.given_name || '',
      last_name: user.family_name || '',
      photo: user.picture || '',
      phone_number: user.phone_number || '',
      gender: user.gender || '',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      birthdate: user.birthdate || new Date().toISOString().split('T')[0]
    };

    return this.userService.registerUserWithAuth(userData).pipe(
      catchError(error => {
        console.error('❌ Error al registrar usuario:', error);
        throw error;
      })
    );
  }
}
