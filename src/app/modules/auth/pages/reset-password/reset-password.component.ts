import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../user.service';
import { ActivatedRoute } from '@angular/router';
import { BackgroundComponent } from 'src/app/shared/components/background/background.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, BackgroundComponent, CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);

  resetPasswordForm: FormGroup = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
      ),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  //Para mostrar contraseña
  passwordVisible1: boolean = false;
  passwordFieldType1: string = 'password';
  //Para mostrar contraseña de confirmación
  passwordVisible2: boolean = false;
  passwordFieldType2: string = 'password';

  token: string = '';
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });
  }

  togglePasswordVisibility(): void {
    this.passwordVisible1 = !this.passwordVisible1;
    this.passwordFieldType1 = this.passwordVisible1 ? 'text' : 'password';
  }
  togglePasswordVisibility2(): void {
    this.passwordVisible2 = !this.passwordVisible2;
    this.passwordFieldType2 = this.passwordVisible2 ? 'text' : 'password';
  }

  onSubmit() {
    try {
      this.resetPasswordForm.markAllAsTouched();
      if (this.resetPasswordForm.valid) {
        this.userService
          .setNewPassword(
            this.token,
            this.resetPasswordForm.get('password').value,
            this.resetPasswordForm.get('confirmPassword').value,
          )
          .subscribe({
            next: response => {
              console.log('Cambio de contraseña exitoso');

              // this.localAuth.clearToken(); Quitar esta línea permite que el usuario sea direccionado a /candidato. De lo contrario, irá al login.
              // this.successOperation = true;
              // this.showModal = true;
            },
            error: error => {
              // this.successOperation = false;
              // this.showModal = true;
              console.error(error);
            },
            complete: () => {
              this.resetPasswordForm.reset(); // Resetear el formulario después de enviar
            },
          });
      }
    } catch (error) {}
  }

  // Getter para acceder a los controles más fácilmente en la plantilla
  get f() {
    return this.resetPasswordForm.controls;
  }
}
