import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { BackgroundComponent } from 'src/app/shared/components/background/background.component';
import { GoogleBtnComponent } from 'src/app/shared/components/google-btn/google-btn.component';
import { PrimaryBtnComponent } from 'src/app/shared/components/primary-btn/primary-btn.component';

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
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }
  loginWithEmail() {
    if (this.loginForm.valid) {
      // Lógica para manejar el envío del formulario
      const {email, password} = this.loginForm.value;
      this.auth.loginWithRedirect({
        authorizationParams: {
          email,
          password,
          connection: 'Challenge-development-DB' // Asegúrate de que este sea el nombre correcto de tu conexión
        }
      }).subscribe({
        next: (result) => {
          console.log('Login successful', result);
        },
        error: (error) => {
          console.error('Login failed', error);
        }
      });

    }
  }

  loginWithGoogle() {
    // Lógica para manejar el inicio de sesión con Google
    this.auth.loginWithRedirect({
      authorizationParams: {
      connection: 'google-oauth2'
      }
    });
  }
  navigateToRegister() {
    // Lógica para navegar a la página de registro
    this.router.navigate(['/register']);
  }

  // Getter para acceder a los controles más fácilmente en la plantilla
  get f() {
    return this.loginForm.controls;
  }
}
