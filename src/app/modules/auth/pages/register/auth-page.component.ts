import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, firstValueFrom } from 'rxjs';
import { GoogleBtnComponent } from 'src/app/shared/components/google-btn/google-btn.component';
import { BackgroundComponent } from 'src/app/shared/components/background/background.component';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PrimaryBtnComponent } from 'src/app/shared/components/primary-btn/primary-btn.component';
import { ModalComponent } from 'src/app/shared/components/info-modal/info-modal.component';

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
  imports: [
    PrimaryBtnComponent,
    GoogleBtnComponent,
    BackgroundComponent,
    ReactiveFormsModule,
    CommonModule,
    ModalComponent,
    
  ],
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
})
export class AuthPageComponent implements OnInit{
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}
  showModal = false;
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
    });
  }
  navigateToLogin() {
    // Lógica para navegar a la página de login
    this.router.navigate(['/login']);
  }
  // Getter para acceder a los controles más fácilmente en la plantilla
  get f() {
    return this.registerForm.controls;
  }

  checkData() {
    console.log('Nombre:', this.f['name'].value);
    console.log('Email:', this.f['email'].value);
    if (this.registerForm.invalid) return;

    const { name, email } = this.registerForm.value;

    this.http
      .get(
        `https://challenge-be-development-99e1.onrender.com/user/FindByEmail`,
        {
          params: { email },
        }
      )
      .subscribe({
        next: response => {
          alert('Este email ya está registrado. Por favor inicia sesión.');
          this.router.navigate(['/login']);
        },
        error: error => {
          if (error.status === 404) {
            this.sendVerificationEmail(name, email);
          } else {
            alert('Error inesperado. Intenta nuevamente.');
            console.error(error);
          }
        },
      });
  }

    sendVerificationEmail(name: string, email: string) {
      console.log('Enviando correo de verificación a:', email);
      console.log('Nombre:', name);
      this.http
        .post(`https://challenge-be-development-99e1.onrender.com/user/send-email-confirmation`, { email,first_name: name })
        .subscribe({
          next: res => {
            this.showModal = true;
            this.registerForm.reset();
          },
          error: error => {
            alert(
              'No se pudo enviar el correo de verificación. Intenta nuevamente.'
            );
            console.error(error);
          },
        });
    }
    closeModal() {
      this.showModal = false;
    }

  /*
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
  }*/
}
