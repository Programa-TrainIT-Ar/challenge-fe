import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { User, AuthService } from '@auth0/auth0-angular';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { query } from '@angular/animations';
import { DashboardCardsService } from './dashboard-cards.service';

@Component({
  selector: 'app-dashboard-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-cards.component.html',
  styleUrl: './dashboard-cards.component.scss',
})
export class DashboardCardsComponent implements OnInit {
  user$: Observable<User | null> = this.auth.user$;
  userName: string = 'Usuario'; // Puedes obtener el nombre de usuario desde algún servicio
  currentDate: Date = new Date(); // Fecha actual
  constructor(
    private auth: AuthService,
    private router: Router,
    private cellService: DashboardCardsService
  ) {}

  //Filtros
  cards = null;

  ngOnInit(): void {
    //Cargando los filtros dinámicamente desde la base de datos
    this.cellService.getAllActiveCells().subscribe((response: any) => {
      this.cards = response.map((card: any, index: number) => {
        // Usamos el índice proporcionado por map y el operador %
        const itemIndex = index % this.items.length;
        card.icon = this.items[itemIndex].icon;
        return card;
      });
      console.log('Cards: ', this.cards);
    });
  }

  items: any[] = [
    // La propiedad search es el string que se usará para filtrar los quizzes al hacer click en el card
    { title: 'Diseño UX', icon: 'assets/ui.png', search: 'UX/UI' },
    {
      title: 'Frontend',
      icon: 'assets/frontend.png',
      search: 'Frontend Developer',
    },
    {
      title: 'Backend',
      icon: 'assets/backend.png',
      search: 'Backend Developer',
    },
    {
      title: 'Fullstack',
      icon: 'assets/fullstack.png',
      search: 'Fullstack Development',
    },
    { title: 'PM', icon: 'assets/qa.png', search: 'P.M.' },
    { title: 'QA', icon: 'assets/scrum.png', search: 'Q.A.' },
  ];

  filtrarQuizzes(filter): void {
    if (filter === 'all') {
      //Si el filtro es all, muestra todos los quizzes
      this.router.navigate(['/dashboard/quizzes']);
    } else {
      //De lo contrario, establece el filtro correspondiente
      this.router.navigate(['dashboard/quizzes/'], {
        queryParams: { cell: filter },
      });
    }
  }
}
