import { Component, OnInit } from '@angular/core';
import { AuthService, User } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit {
  user$: Observable<User | null> = this.auth.user$;
  userName: string = 'Usuario'; // Puedes obtener el nombre de usuario desde algún servicio
  currentDate: Date = new Date(); // Fecha actual
  items: any[] = [
    { title: 'Diseño UX', icon: 'assets/ui.png' },
    { title: 'Frontend', icon: 'assets/frontend.png' },
    { title: 'Backend', icon: 'assets/backend.png' },
    { title: 'Fullstack', icon: 'assets/fullstack.png' },
    { title: 'PM', icon: 'assets/qa.png' },
    { title: 'QA', icon: 'assets/scrum.png' },
  ];

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}
}
