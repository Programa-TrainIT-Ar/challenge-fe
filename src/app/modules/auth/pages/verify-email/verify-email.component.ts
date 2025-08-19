import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss'],
})
export class VerifyEmailComponent implements OnInit {
  loading = true;

  showModal = false;
  currentModal: 'expired' | 'invalid' | 'notConfirmed' | 'error' | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (!token) {
        this.showModal = true;
        this.currentModal = 'invalid';
        this.loading = false;
        return;
      }

      this.userService.VerifyEmail(token).subscribe({
        next: (res: any) => {
          this.loading = false;
          if (res.emailConfirmed === true) {
            const id = res.user_id;
            const email = res.email;
            const name = res.name || '';
            this.router.navigate(['/account-setup'], {
              queryParams: { email, name, id },
            });
          } else {
            this.showModal = true;
            this.currentModal = 'notConfirmed';
          }
        },
        error: error => {
          this.loading = false;
          if (error.status === 400) {
            this.showModal = true;
            this.currentModal = 'expired';
          } else {
            this.showModal = true;
            this.currentModal = 'error';
          }
        },
      });
    });
  }

  closeModal() {
    this.showModal = false;
    this.currentModal = null;
    this.router.navigate(['/register']); // o donde quieras que vaya si falla
  }
}
