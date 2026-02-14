import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { BackgroundComponent } from 'src/app/shared/components/background/background.component';
import { GoogleBtnComponent } from 'src/app/shared/components/google-btn/google-btn.component';
import { PrimaryBtnComponent } from 'src/app/shared/components/primary-btn/primary-btn.component';
import { filter, finalize, take, tap } from 'rxjs';
import {
  LoginResponse,
  UserService,
} from 'src/app/modules/auth/pages/user.service';
import { LocalAuthService } from '../../local-auth.service';
import { AlertService } from 'src/app/shared/components/alert/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    PrimaryBtnComponent,
    GoogleBtnComponent,
    BackgroundComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  showPassword: boolean = false;

  // Custom Claim para roles en Auth0
  private AUTH0_ROLES_CLAIM = 'https://miaplicacion.com/roles';

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private router: Router,
    private userService: UserService,
    private localAuthService: LocalAuthService,
    private alertService: AlertService
  ) {}

  isLoading = false;

  httpStatusMessages: Record<number, string> = {
    401: 'Usuario y/o contraseña incorrecta.',
    403: 'Usuario y/o contraseña incorrecta.',
    423: 'Tu cuenta está temporalmente bloqueada. Intenta en 15 minutos.',
    429: 'Demasiados intentos. Intenta nuevamente en unos minutos.',
  };

  ngOnInit(): void {
    //Verficiación de inicio de sesión con Auth0
    // Si Auth0 detecta un usuario logueado, se le redirige a una ruta segura,
    // y el RoleGuard se encargará de enviarlo a /home o /dashboard.
    this.auth.user$
      .pipe(
        tap(user =>
          console.log('🔒 Verificando autenticación del usuario:', user)
        ),
        filter(user => !!user),
        take(1)
      )
      .subscribe(user => {
        // Redirección directa. El Guard hace la validación de rol.
        this.router.navigate(['/dashboard']);
      });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  //Login con credenciales
  loginLocal() {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true; // Empieza a cargar
      this.loginForm.disable({ emitEvent: false });

      const { email, password } = this.loginForm.value;

      this.userService
        .loginWithEmail(email, password)
        .pipe(
          finalize(() => {
            this.isLoading = false;
            this.loginForm.enable({ emitEvent: false });
          })
        )
        .subscribe({
          next: (response: LoginResponse) => {
            const accessToken = response.access_token;

            // 1. Guardar el token (esto también notifica al UserStateService internamente)
            this.localAuthService.setToken(accessToken);
            this.alertService.showSuccess('Inicio de sesión exitoso');

            // 2. Redirección directa. El RoleGuard en /dashboard validará el rol.
            this.router.navigate(['/dashboard']);
          },
          error: error => {
            console.error('🔒 Error al iniciar sesión:', error);
            this.isLoading = false; // Detiene la carga al tener un error
            // Aquí se podría mostrar un mensaje de error al usuario
          },
        });
    }
  }

  navigateToRegister() {
    // Lógica para navegar a la página de registro
    this.router.navigate(['/register']);
  }

  forgotPassword() {
    // Lógica para navegar a la página de recuperación de contraseña
    this.router.navigate(['/forgot-password']);
  }
  // Getter para acceder a los controles más fácilmente en la plantilla
  get f() {
    return this.loginForm.controls;
  }
}
