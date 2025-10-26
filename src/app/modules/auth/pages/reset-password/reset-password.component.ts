import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BackgroundComponent } from 'src/app/shared/components/background/background.component';
import { CommonModule } from '@angular/common';
import { ModalComponent } from 'src/app/shared/components/info-modal/info-modal.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, BackgroundComponent, CommonModule, ModalComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  private userService = inject(UserService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  resetPasswordForm: FormGroup = new FormGroup(
    {
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(
          /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
        ),
      ]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    {
      validators: this.passwordMatchValidator, // Validador a nivel de FormGroup
    }
  );

  //Para mostrar contraseña
  passwordVisible1: boolean = false;
  passwordFieldType1: string = 'password';
  //Para mostrar contraseña de confirmación
  passwordVisible2: boolean = false;
  passwordFieldType2: string = 'password';

  showModal = false;
  successOperation = false; //Determina el contenido de la modal a mostrar al presionar el botón

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
            this.resetPasswordForm.get('confirmPassword').value
          )
          .subscribe({
            next: response => {
              console.log('Cambio de contraseña exitoso');

              // this.localAuth.clearToken(); Quitar esta línea permite que el usuario sea direccionado a /candidato. De lo contrario, irá al login.
              this.successOperation = true;
              this.showModal = true;
            },
            error: error => {
              this.successOperation = false;
              this.showModal = true;
              console.error(error);
            },
            complete: () => {
              this.resetPasswordForm.reset(); // Resetear el formulario después de enviar
            },
          });
      }
    } catch (error) {}
  }

  //Validador personalizado para validar contraseña
  passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    // Si ya tiene un error y no es 'mismatch', no se sobreescribirá
    if (confirmPassword.errors && !confirmPassword.errors['mismatch']) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ mismatch: true }); // Establece el error en el control de confirmación
      return { mismatch: true }; // También devuelve el error a nivel de FormGroup
    } else {
      confirmPassword.setErrors(null); // Borra el error si coinciden
      return null;
    }
  }

  // Getter para acceder a los controles más fácilmente en la plantilla
  get f() {
    return this.resetPasswordForm.controls;
  }

  closeModal() {
    this.showModal = false;
  }

  finalizarProceso() {
    this.showModal = false;
    //Redirreccionar a /candidato una vez leído el mensaje de éxito en la operación.
    this.router.navigate(['/login']);
  }
}
