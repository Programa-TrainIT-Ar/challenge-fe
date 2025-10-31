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
    429: 'Demasiados intentos. Intenta nuevamente en unos minutos.'
  };

  ngOnInit(): void {
    //Verficiación de inicio de sesión con Auth0
    this.auth.user$
      .pipe(
        tap(user =>
          console.log('🔒 Verificando autenticación del usuario:', user)
        ),
        filter(user => !!user),
        take(1)
      )
      .subscribe(user => {
        // 💡 Se asume que el objeto user de Auth0 contiene el rol en un custom claim
        const roles: string[] = user[this.AUTH0_ROLES_CLAIM] || [];
        const isAdmin = roles.includes('admin');
        console.log('Rol:', roles);

        const redirectPath = isAdmin ? '/home' : '/dashboard';
        this.router.navigate([redirectPath]);
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

      this.userService.loginWithEmail(email, password).pipe(
        finalize(()=> {
          this.isLoading = false;
          this.loginForm.enable({ emitEvent: false });
        })
      ).subscribe({
        next: (response: LoginResponse) => {
          const accessToken = response.access_token;

          // 1. Guardar el token (esto también notifica al UserStateService internamente)
          this.localAuthService.setToken(accessToken);
          this.alertService.showSuccess('Inicio de sesión exitoso');

          // 2. Obtener el payload decodificado para leer el rol
          const userPayload = this.localAuthService.getUser();

          let redirectPath = '/dashboard'; // Default: Candidato
          console.log('Rol:', userPayload.role);
          // 3. Redirección condicional
          if (userPayload && userPayload.role === 'admin') {
            redirectPath = '/home'; // Admin
          } else if (userPayload && userPayload.role === 'candidato') {
            redirectPath = '/dashboard';
          }

          this.router.navigate([redirectPath]);

        },
        error: (error) => {
          console.error('🔒 Error al iniciar sesión:', error);
          this.isLoading = false; // Detiene la carga al tener un error
          // Aquí se podría mostrar un mensaje de error al usuario
        }
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
