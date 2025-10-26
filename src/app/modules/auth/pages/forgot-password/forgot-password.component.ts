import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BackgroundComponent } from 'src/app/shared/components/background/background.component';
import { GoogleBtnComponent } from 'src/app/shared/components/google-btn/google-btn.component';
import { PrimaryBtnComponent } from 'src/app/shared/components/primary-btn/primary-btn.component';
import { UserService } from 'src/app/modules/auth/pages/user.service';
import { ModalComponent } from 'src/app/shared/components/info-modal/info-modal.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    BackgroundComponent,
    PrimaryBtnComponent,
    GoogleBtnComponent,
    ReactiveFormsModule,
    CommonModule,
    ModalComponent,
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
})
export class ForgotPasswordComponent implements OnInit {
  emailForm: FormGroup;
  showModal = false;
  successOperation = false; //Determina el contenido de la modal a mostrar al presionar el botón
  responseMessage = ''; //Mensaje a mostrar en el modal

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  sendResetMail() {
    if (this.emailForm.valid) {
      this.userService.sendResetLink(this.emailForm.value.email).subscribe({
        next: response => {
          this.successOperation = true;
          this.responseMessage =
            'Enlace de recuperación enviado, revisa tu bandeja de entrada';
          this.showModal = true;
        },
        error: error => {
          this.successOperation = false;
          this.showModal = true;
          this.responseMessage = 'Error en el envío del correo de recuperación';
          console.log(error);
        },
      });
    }
  }

  finalizarProceso() {
    this.showModal = false;
    //Redireccionar una vez leído el mensaje de éxito en la operación.
    if (this.successOperation) this.router.navigate(['/login']);
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
