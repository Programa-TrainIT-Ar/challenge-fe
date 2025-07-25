import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SignUpService } from './sign-up.service';

@Component({
  selector: 'app-auth-sign-in-page',

  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent implements OnInit {
  registerForm: FormGroup;
  //Para mostrar contraseña
  passwordVisible1: boolean = false;
  passwordFieldType1: string = 'password';
  //Para mostrar contraseña de confirmación
  passwordVisible2: boolean = false;
  passwordFieldType2: string = 'password';

  constructor(
    private fb: FormBuilder,
    private SignUpService: SignUpService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        first_name: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/),
          ],
        ],
        last_name: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/),
          ],
        ],
        email: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
            ),
          ],
        ],
        phone_number: ['', [Validators.required, Validators.pattern(/^\+\d+$/),Validators.minLength(8), Validators.maxLength(11)]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(
              /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: this.passwordMatchValidator, // Validador a nivel de FormGroup
      }
    );
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

  togglePasswordVisibility(): void {
    this.passwordVisible1 = !this.passwordVisible1;
    this.passwordFieldType1 = this.passwordVisible1 ? 'text' : 'password';
  }
  togglePasswordVisibility2(): void {
    this.passwordVisible2 = !this.passwordVisible2;
    this.passwordFieldType2 = this.passwordVisible2 ? 'text' : 'password';
  }


  onSubmit(): void {
    try {
      this.registerForm.markAllAsTouched();
      if (this.registerForm.valid) {
        this.SignUpService.registerUser(this.registerForm.value).subscribe({
          next: response => {
            alert('¡Registro exitoso! ');
            console.log('Resultado: ', response);
          },
          error: error => {
            alert('Ocurrió un error inesperado.');
            console.error(error.message);
          },
          complete: () => {
            this.registerForm.reset(); // Resetear el formulario después de enviar
          },
        });
      } else {
        console.log('Formulario inválido. Por favor, revisa los errores.');
        // Marca todos los campos como "touched" para que se muestren los mensajes de error
        // this.registerForm.markAllAsTouched();
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // Getter para acceder a los controles más fácilmente en la plantilla
  get f() {
    return this.registerForm.controls;
  }
}
