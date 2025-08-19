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
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private userService: UserService
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
      this.userService.VerifyEmail(token).subscribe({
        next: (res: any) => {
          this.loading = false;
          // Validamos que el email esté confirmado
          if (res.emailConfirmed === true) {
            const id = res.id;
            const email = res.email;
            const first_name = res.first_name || res.name || '';
            this.router.navigate(['/account-setup'], {
              queryParams: { email, first_name, id },
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
