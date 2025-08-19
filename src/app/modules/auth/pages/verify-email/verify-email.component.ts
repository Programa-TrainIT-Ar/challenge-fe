import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
  loading = true;
  showModal = false;
  currentModal: 'expired' | 'invalid' | 'unexpected' | null = null;
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

      // Confirmar el email con el token
      this.userService.VerifyEmail(token).subscribe({
        next: (res: any) => {
          this.loading = false;

          if (res.emailConfirmed === true) {
            const id = res.user_id;
            const email = res.email;
            const first_name = res.first_name || res.name || '';
            this.router.navigate(['/account-setup'], {
              queryParams: { email, first_name, id },
            });
          } else {
            this.currentModal = 'unexpected';
            this.modalMessageBody = 'El email no ha sido confirmado aún.';
            this.showModal = true;
          }
        },
        error: error => {
          this.loading = false;
          if (error.status === 400) {
            this.currentModal = 'expired';
            this.modalMessageBody = 'El enlace ha expirado o es inválido.';
          } else {
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
