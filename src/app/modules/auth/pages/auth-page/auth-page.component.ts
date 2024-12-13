import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, firstValueFrom } from 'rxjs';

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
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
})
export class AuthPageComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.handleAuthentication();
  }

  login() {
    this.auth.loginWithRedirect({
      appState: { returnTo: window.location.pathname },
    });
    
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
      // Usa el endpoint existente del backend
      const response = await firstValueFrom(
        this.http.post(`${environment.url}/user`, userData).pipe(
          catchError(async error => {
            if (error.status === 400 && error.error?.user) {
              // Si el usuario ya existe, retornamos los datos del usuario>>>>>>>>>>>>>
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
      // Obtiene los roles desde los metadatos de Auth0 >>>>>>>>>>>>>>
      const roles = user['https://miaplicacion.com/roles'] || [];
      const isEmailVerified = user.email_verified;
      // Si el email no está verificado, redirige a una página de verificación probar!!!!
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

  // Método para manejar errores de autenticación
  private handleAuthError(error: any) {
    console.error('Error de autenticación:', error);

    this.router.navigate(['/error']);
  }
}