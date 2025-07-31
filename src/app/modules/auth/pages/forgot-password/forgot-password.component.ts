import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BackgroundComponent } from 'src/app/shared/components/background/background.component';
import { GoogleBtnComponent } from 'src/app/shared/components/google-btn/google-btn.component';
import { PrimaryBtnComponent } from 'src/app/shared/components/primary-btn/primary-btn.component';
import { UserService } from 'src/app/modules/auth/pages/user.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    BackgroundComponent,
    PrimaryBtnComponent,
    GoogleBtnComponent,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent implements OnInit{

  emailForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.emailForm.valid) {
      this.userService.sendResetLink(this.emailForm.value.email)
        .subscribe({
          next: () => {
            // Handle successful response
            console.log('Reset link sent successfully');
            
            //después de la respuesta del back exitosa
            this.router.navigate(['/confirmation'], {queryParams: {type: 'pass'}})
          },
          error: (error) => {
            // Handle error response
            console.error('Error sending reset link:', error);
          }
        });
    }
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
