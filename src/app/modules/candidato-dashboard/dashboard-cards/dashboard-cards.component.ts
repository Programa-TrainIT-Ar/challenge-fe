import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { User, AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-cards.component.html',
  styleUrl: './dashboard-cards.component.scss',
})
export class DashboardCardsComponent {
  user$: Observable<User | null> = this.auth.user$;
  userName: string = 'Usuario'; // Puedes obtener el nombre de usuario desde algún servicio
  currentDate: Date = new Date(); // Fecha actual
  constructor(private auth: AuthService) {}

  items: any[] = [
    { title: 'Diseño UX', icon: 'assets/ui.png' },
    { title: 'Frontend', icon: 'assets/frontend.png' },
    { title: 'Backend', icon: 'assets/backend.png' },
    { title: 'Fullstack', icon: 'assets/fullstack.png' },
    { title: 'PM', icon: 'assets/qa.png' },
    { title: 'QA', icon: 'assets/scrum.png' },
  ];
}
