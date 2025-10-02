import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { BackgroundComponent } from 'src/app/shared/components/background/background.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalComponent } from 'src/app/shared/components/info-modal/info-modal.component';
import { UserService } from '../../user.service';
import { ActivatedRoute } from '@angular/router';
import { LocalAuthService } from '../../../local-auth.service';

@Component({
  selector: 'app-sign-up-page',
  standalone: true,
  imports: [
    BackgroundComponent,
    ReactiveFormsModule,
    CommonModule,
    ModalComponent,
  ],
  templateUrl: './account-setup.component.html',
  styleUrl: './account-setup.component.scss',
})
export class AccountSetupComponent implements OnInit {
  registerForm: FormGroup;
  //Para mostrar contraseña
  passwordVisible1: boolean = false;
  passwordFieldType1: string = 'password';
  //Para mostrar contraseña de confirmación
  passwordVisible2: boolean = false;
  passwordFieldType2: string = 'password';

  showModal = false;
  successOperation = false; //Determina el contenido de la modal a mostrar al presionar el botón

  //Variables para almacenar datos de la url al renderizar el componente
  id: string | null = null;
  first_name: string | null = null;
  email: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private localAuth: LocalAuthService
  ) {}

  ngOnInit(): void {
    try {
      //Tomando parámetros de la url
      this.id = this.route.snapshot.queryParamMap.get('id');
      this.first_name = this.route.snapshot.queryParamMap.get('first_name');
      this.email = this.route.snapshot.queryParamMap.get('email');
    } catch (error) {
      console.log('Error al cargar parámetros desde la url');
    }

    //Validaciones de cada campo del formulario
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
            ,
            Validators.required,
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
            ),
          ],
        ],
        phone_number: [
          '',
          [
            Validators.required,
            Validators.pattern(/^\+\d+$/),
            Validators.minLength(8),
            Validators.maxLength(11),
          ],
        ],
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

    //Cargar campos de la url en el formulario si existen
    if (this.first_name) {
      this.registerForm.get('first_name')?.setValue(this.first_name);
      this.registerForm.get('first_name')?.disable(); //Desactiva el input
    }

    if (this.email) {
      this.registerForm.get('email')?.setValue(this.email);
      this.registerForm.get('email')?.disable(); //Desactiva el input
    }
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
        if (!this.id) {
          //Si no hay id
          console.error(
            'ID de usuario no encontrado en la URL. No se puede actualizar.'
          );
          return;
        }

        this.userService
          .accountSetup(this.id, this.registerForm.value)
          .subscribe({
            next: response => {
              this.localAuth.clearToken();
              this.successOperation = true;
              this.showModal = true;
              this.router.navigate(['/candidato']);
            },
            error: error => {
              this.successOperation = false;
              this.showModal = true;
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

  closeModal() {
    this.showModal = false;
  }
}
