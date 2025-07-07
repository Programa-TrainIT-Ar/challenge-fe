import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-auth-sign-in-page',

  templateUrl: './auth-sign-in-page.component.html',
  styleUrl: './auth-sign-in-page.component.scss',
})
export class AuthSignInPageComponent implements OnInit {
  registerForm: FormGroup;
  submitted = false; //Permite evaluar cada campo del formulario

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        nombre: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/),
          ],
        ],
        apellido: [
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
        phone: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
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
        'password-2': ['', Validators.required],
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
    const confirmPassword = control.get('password-2');

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

  onSubmit(): void {
    console.log('Pisando botón');
    this.submitted = true;
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      console.log(
        'Formulario válido, enviando datos:',
        this.registerForm.value
      );
      alert('¡Registro exitoso!');
      this.registerForm.reset(); // Opcional: resetear el formulario después de enviar
      this.submitted = false;
    } else {
      console.log('Formulario inválido. Por favor, revisa los errores.');
      // Marca todos los campos como "touched" para que se muestren los mensajes de error
      // this.registerForm.markAllAsTouched();
    }
  }

  // Getter para acceder a los controles más fácilmente en la plantilla
  get f() {
    return this.registerForm.controls;
  }
}
