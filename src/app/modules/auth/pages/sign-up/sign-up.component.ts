import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  isValidToken = false;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (token) {
      this.verifyToken(token);
    } else {
      alert('Token no encontrado en la URL.');
      this.router.navigate(['/auth']);
    }
  }

  verifyToken(token: string) {
    this.http
      .get(`https://challenge-be-development-99e1.onrender.com/user/verify-token`, {
        params: { token },
      })
      .subscribe({
        next: (res: any) => {
          console.log('✅ Token válido:', res);
          this.isValidToken = true;
          this.isLoading = false;
          // Aquí podrías permitir mostrar el formulario de registro completo
        },
        error: err => {
          console.error('❌ Token inválido o expirado:', err);
          alert('Este enlace no es válido o ha expirado.');
          this.router.navigate(['/auth']);
        },
      });
  }
}
