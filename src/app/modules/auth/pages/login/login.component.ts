import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { BackgroundComponent } from 'src/app/shared/components/background/background.component';
import { GoogleBtnComponent } from 'src/app/shared/components/google-btn/google-btn.component';
import { PrimaryBtnComponent } from 'src/app/shared/components/primary-btn/primary-btn.component';
import { filter, take, tap } from 'rxjs';
import { LoginResponse, UserService } from 'src/app/modules/auth/pages/user.service';
import { LocalAuthService } from '../../local-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    PrimaryBtnComponent,
    GoogleBtnComponent,
    BackgroundComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private router: Router,
    private userService: UserService,
    private localAuthService: LocalAuthService
  ) {}

  ngOnInit(): void {

    //Verficiación de inicio de sesión con Auth0
    this.auth.user$.pipe(
      tap(user => console.log('🔒 Verificando autenticación del usuario:', user)),
      filter(user => !!user),
      take(1)
    ).subscribe(() => {
      this.router.navigate(['/home']);
      console.log('🔒 Usuario ya autenticado, redirigiendo a home');
    });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  //Login con credenciales 
  loginLocal() {
    if (this.loginForm.valid) {
      // Lógica para manejar el envío del formulario
      const {email, password} = this.loginForm.value;
      this.userService.loginWithEmail(email, password).subscribe({
        next: (response: LoginResponse) => {
          console.log('🔒 Inicio de sesión exitoso:', response);
          const accessToken = response.access_token; // Asegúrate de que la respuesta tenga el token en este formato
          this.localAuthService.setToken(accessToken); 
          // Accede al contenido de la llave access_token
            
          console.log('Access Token:', accessToken);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('🔒 Error al iniciar sesión:', error);
          // Aquí podrías mostrar un mensaje de error al usuario
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
