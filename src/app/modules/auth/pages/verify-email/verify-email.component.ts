import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { ModalComponent } from 'src/app/shared/components/info-modal/info-modal.component';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
  loading = true;

  // Modal
  showModal = false;
  currentModal: 'invalid' | 'expired' | 'unexpected' | null = null;
  modalMessageBody = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (!token) {
        this.currentModal = 'invalid';
        this.modalMessageBody = 'Token no proporcionado.';
        this.showModal = true;
        this.loading = false;
        return;
      }

      this.userService.VerifyEmail(token).subscribe({
        next: (res: any) => {
          this.loading = false;

          if (res.emailConfirmed === true) {
            // Redirigir directo a account-setup
            const id = res.user_id;
            const email = res.email;
            const first_name = res.first_name || res.name || '';
            this.router.navigate(['/account-setup'], {
              queryParams: { email, name, id },
            });
          } else {
            // Modal de error inesperado
            this.currentModal = 'unexpected';
            this.modalMessageBody = 'No se pudo confirmar el email. Por favor intenta nuevamente.';
            this.showModal = true;
          }
        },
        error: error => {
          this.loading = false;

          if (error.status === 400) {
            // Modal de token expirado o inválido
            this.currentModal = 'expired';
            this.modalMessageBody = 'El enlace ha expirado o es inválido.';
          } else {
            // Modal de error inesperado
            this.currentModal = 'unexpected';
            this.modalMessageBody = 'Error inesperado al verificar el token.';
          }
          this.showModal = true;
        },
      });
    });
  }

  closeModal() {
    this.showModal = false;
    this.currentModal = null;
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}
