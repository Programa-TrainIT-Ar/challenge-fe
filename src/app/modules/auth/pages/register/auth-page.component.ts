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

interface UserData {
  email: string;
  first_name?: string;
  last_name?: string;
  photo?: string;
  phone_number?: string;
  timezone?: string;
  gender?: string;
  password?: string;
  birthdate?: Date;
}

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
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss'],
})
export class AuthPageComponent implements OnInit {
  registerForm: FormGroup;

  showModal = false;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private http: HttpClient, 
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

  // Método principal llamado al enviar el formulario
  submit() {
    if (this.registerForm.invalid) return;

    const { name, email } = this.registerForm.value;
    this.sendVerificationEmail(name, email);
  }

  sendVerificationEmail(name: string, email: string) {
    this.userService
      .sentEmailVerification(email, name)
      .subscribe({
        next: res => {
          switch (res['action']) {
            case 'login':
              //alert(res['message']);
              this.router.navigate(['/login']);
              break;
            case 'pending':
            case 'verification_sent':
              this.showModal = true;
              this.registerForm.reset();
              break;
            default:
              alert('Respuesta inesperada del servidor.');
          }
        },
        error: error => {
          alert(
            'No se pudo enviar el correo de verificación. Intenta nuevamente.'
          );
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
