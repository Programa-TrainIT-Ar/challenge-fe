import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, firstValueFrom } from 'rxjs';
import { GoogleBtnComponent } from 'src/app/shared/components/google-btn/google-btn.component';
import { BackgroundComponent } from 'src/app/shared/components/background/background.component';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PrimaryBtnComponent } from 'src/app/shared/components/primary-btn/primary-btn.component';
import { ModalComponent } from 'src/app/shared/components/info-modal/info-modal.component';
import { UserService } from '../user.service';
@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    PrimaryBtnComponent,
    GoogleBtnComponent,
    BackgroundComponent,
    ReactiveFormsModule,
    CommonModule,
    ModalComponent,
  ],
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss'],
})
export class AuthPageComponent implements OnInit {
  registerForm: FormGroup;
  showModal = false;
  currentModal: 'login' | 'pending' | 'verification_sent' | 'error' =
    'verification_sent';
  modalMessageBody = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      name: ['', [Validators.required]],
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  submit() {
    if (this.registerForm.invalid) return;
    const { name, email } = this.registerForm.value;
    this.sendVerificationEmail(name, email);
  }

  sendVerificationEmail(name: string, email: string) {
    this.userService.sentEmailVerification(email, name).subscribe({
      next: res => {
        switch (res['action']) {
          case 'login':
            this.currentModal = 'login';
            this.modalMessageBody = res['message'];
            this.showModal = true;
            break;

          case 'pending':
            this.currentModal = 'pending';
            this.modalMessageBody = res['message'];
            this.showModal = true;
            this.registerForm.reset();
            break;

          case 'verification_sent':
            this.currentModal = 'verification_sent';
            this.modalMessageBody = res['message'];
            this.showModal = true;
            this.registerForm.reset();
            break;

          default:
            this.currentModal = 'error';
            this.modalMessageBody = 'Respuesta inesperada del servidor.';
            this.showModal = true;
        }
      },
      error: error => {
        this.currentModal = 'error';
        this.modalMessageBody =
          'No se pudo enviar el correo de verificación. Intenta nuevamente.';
        this.showModal = true;
        console.error(error);
      },
    });
  }

  closeModal() {
    this.showModal = false;
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}
