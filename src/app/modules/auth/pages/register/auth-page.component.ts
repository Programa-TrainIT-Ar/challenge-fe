import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, firstValueFrom } from 'rxjs';
import { GoogleBtnComponent } from 'src/app/shared/components/google-btn/google-btn.component';

interface UserData {
  email: string;
  first_name?: string;
  last_name?: string;
  photo?: string;
  phone_number?: string;
  timezone?: string;
  gender?: string;
  password?: string;
  birthdate?: Date;
}

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [GoogleBtnComponent],
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
})
export class AuthPageComponent {
  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  async login() {
    this.router.navigate(['/login']);
    /* try {
      // Usar loginWithPopup en lugar de loginWithRedirect
      await this.auth.loginWithPopup();
      
      
      await this.handleAuthentication();
    } catch (error) {
      console.error('Error durante el login:', error);
      this.handleAuthError(error);
    } */
  }

  private async handleAuthentication() {
    try {
      const user = await firstValueFrom(this.auth.user$);

      if (!user) {
        console.log('No hay usuario autenticado.');
        return;
      }

      const userData: UserData = {
        email: user.email,
        first_name: user.given_name || '',
        last_name: user.family_name || '',
        photo: user.picture || '',
        phone_number: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        gender: '',
        password: 'auth0_' + Math.random().toString(36).slice(-8), // Password aleatorio
      };

      try {
        const response = await this.registerOrAuthenticateUser(userData);
        if (response) {
          console.log('Operación exitosa:', response);
          await this.handleUserRedirection(user);
        }
      } catch (error) {
        console.error('Error al procesar el usuario:', error);
        this.router.navigate(['/error']);
      }
    } catch (error) {
      console.error('Error de autenticación:', error);
      this.router.navigate(['/error']);
    }
  }

  private async registerOrAuthenticateUser(userData: UserData): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.post(`${environment.url}/user`, userData).pipe(
          catchError(async error => {
            if (error.status === 400 && error.error?.user) {
              return error.error;
            }
            throw error;
          })
        )
      );

      return response;
    } catch (error) {
      console.error('Error en la operación:', error);
      throw error;
    }
  }

  private async handleUserRedirection(user: any) {
    try {
      const roles = user['https://miaplicacion.com/roles'] || [];
      const isEmailVerified = user.email_verified;

      // Si el email no está verificado, redirige a una página de verificación
      // if (!isEmailVerified) {
      //   this.router.navigate(['/verify-email']);
      //   return;
      // }

      // Redirige según el rol del usuario
      if (roles.includes('admin')) {
        await this.router.navigate(['/home']);
      } else {
        await this.router.navigate(['/candidato']);
      }
    } catch (error) {
      console.error('Error en la redirección:', error);
      this.router.navigate(['/error']);
    }
  }

  private handleAuthError(error: any) {
    console.error('Error de autenticación:', error);
    this.router.navigate(['/error']);
  }
}