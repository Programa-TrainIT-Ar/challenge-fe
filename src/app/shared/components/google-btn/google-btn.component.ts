import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UserService, UserData } from 'src/app/modules/auth/pages/user.service';
import { Subject, takeUntil, filter, switchMap, catchError, of } from 'rxjs';

@Component({
  selector: 'app-google-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './google-btn.component.html',
  styleUrl: './google-btn.component.scss'
})
export class GoogleBtnComponent {
  @Input() buttonText: string = 'Continuar con Google';
  
  constructor(
    private auth: AuthService,
    private userService: UserService
  ) {}

  async onGoogleClick(): Promise<void> {

    try {
      await this.auth.loginWithRedirect({
        authorizationParams: {
          connection: 'google-oauth2',
          prompt: 'select_account',
        }
      });
      console.log('Login exitoso');

    } catch (error) {
      console.error('Error en login:', error);
    } 
  }
/* 
  private handleUserRegistration(user: any): void {
    this.userService.finduserByEmail(user.email!).pipe(
      switchMap((existingUser: any) => {
        if (existingUser) {
          console.log('User already exists:', existingUser);
          return of(existingUser); // Usuario existe, retornar el usuario
        } else {
          // Usuario no existe, crear nuevo
          console.log('New user, registering...');
          const userData: UserData = {
            email: user.email,
            first_name: user.given_name || '',
            last_name: user.family_name || '',
            photo: user.picture || '',
            phone_number: user.phone_number || '',
            gender: user.gender || '',
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            birthdate: user.birthdate || new Date().toISOString().split('T')[0] // Solo fecha
          };
          return this.userService.registerUser(userData);
        }
      }),
      catchError((error) => {
        console.error('Error in user operation:', error);
        
        // Si es error 404 (usuario no encontrado), intentar registrar
        if (error.status === 404) {
          console.log('User not found (404), registering new user...');
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
          return this.userService.registerUser(userData);
        }
        
        return of(null); // Retornar null en caso de error
      }),
      takeUntil(this.destroy$) // Cancelar si el componente se destruye
    ).subscribe({
      next: (result) => {
        if (result) {
          console.log('Operation completed successfully:', result);
          // Aquí puedes agregar lógica adicional después del registro/login
        }
      },
      error: (error) => {
        console.error('Final error in user registration process:', error);
      }
    });
  } */
}