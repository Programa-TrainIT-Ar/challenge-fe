import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
  loading = true;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    console.log('VerifyEmailComponent ngOnInit');
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (!token) {
        this.errorMessage = 'Token no proporcionado';
        this.loading = false;
        return;
      }

      // Confirmar el email con el token
      this.http
        .post('https://challenge-be-development-99e1.onrender.com/user/confirm-email', { token })
        .subscribe({
          next: (res: any) => {
            this.loading = false;
            // Validamos que el email esté confirmado
            if (res.emailConfirmed === true) {
              const email = res.email;
              const name = res.first_name || res.name || ''; 
              this.router.navigate(['/account-setup'], {
                queryParams: { email, name },
              });
            } else {
              this.errorMessage = 'El email no ha sido confirmado aún.';
            }
          },
          error: error => {
            this.loading = false;
            if (error.status === 400) {
              this.errorMessage = 'El enlace ha expirado o es inválido.';
            } else {
              this.errorMessage = 'Error inesperado al verificar el token.';
            }
          },
        });
    });
  }
}
