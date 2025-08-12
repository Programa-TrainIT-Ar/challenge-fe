import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-google-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './google-btn.component.html',
  styleUrl: './google-btn.component.scss'
})
export class GoogleBtnComponent {
  @Input() buttonText: string = 'Continuar con Google';
  
  constructor( private auth: AuthService ) {}

  async onGoogleClick(): Promise<void> {

    try {
      console.log('🚀 Iniciando login con Google...');
      await this.auth.loginWithRedirect({
        authorizationParams: {
          connection: 'google-oauth2',
          prompt: 'select_account',
        }
      });
    } catch (error) {
      console.error('❌ Error en login:', error);
    }
  }
}