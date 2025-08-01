import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { UserService, UserData } from 'src/app/modules/auth/pages/user.service';
import { Subject, takeUntil, filter, switchMap, catchError, of, throwError, map } from 'rxjs';

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
      console.log('✅ Login exitoso');
      this.auth.user$.pipe(
        filter(user => !!user && !!user.email),
        map(user => {
           this.userService.finduserByEmail(user.email).pipe(
            map(existingUser => {
          if (!existingUser) {
            return this.handleUserRegistration(user);
          } else {
            return of(existingUser); // Devolver existente
          }
        })
      );
      })
    )
    } catch (error) {
      console.error('❌ Error en login:', error);
    }
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

    return this.userService.registerUser(userData).pipe(
      catchError(error => {
        console.error('❌ Error al registrar usuario:', error);
        throw error;
      })
    );
  }
}