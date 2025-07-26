import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-google-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './google-btn.component.html',
  styleUrl: './google-btn.component.scss'
})
export class GoogleBtnComponent {
  @Input() buttonText: string = 'Continuar con Google'; // Texto por defecto

  constructor(private auth: AuthService) {}

  onGoogleClick(): void {
    this.auth.loginWithRedirect({
      authorizationParams: {
        connection: 'google-oauth2',
        prompt: 'select_account' // Permite seleccionar cuenta
      }
    });
  }
}
