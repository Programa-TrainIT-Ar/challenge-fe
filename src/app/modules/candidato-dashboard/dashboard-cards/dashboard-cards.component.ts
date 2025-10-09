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
  uniqueCells = null; //Para almacenar las cards sin duplicados
  model_one = true; //Modelo de Cards - True → Modelo 1. False → Modelo 2

  ngOnInit(): void {
    //Cargando los filtros dinámicamente desde la base de datos
    this.cellService
      .getAllActiveCellsWithQuizzes()
      .subscribe((response: any) => {
        this.cards = response.map((card: any, index: number) => {
          // Usamos el índice proporcionado por map y el operador %
          const itemIndex = index % this.icons.length;
          card.icon = this.icons[itemIndex];
          return card;
        });
        this.uniqueCells = this.filterDuplicateCells(this.cards); //Eliminando cards duplicadas
               
        //Establecer modelo de Cards a usar dependiendo de la cantidad de células
        if(this.uniqueCells.length <= 6){
          this.model_one = true; //Se usa el primer modelo de Cards
        } else {
          this.model_one = false; //Se usa el segundo modelo de Cards
        }
      });
  }

  icons = [
    // 'assets/ui.png',
    'assets/frontend.png',
    'assets/backend.png',
    'assets/fullstack.png',
    'assets/qa.png',
    'assets/scrum.png',
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

  filterDuplicateCells(cells) {
    // Usamos un Map para almacenar las células, con el nombre como clave (key).
    // Esto asegura que cada nombre solo se pueda almacenar una vez.
    const uniqueCellsMap = new Map();

    for (const cell of cells) {
      // Si el nombre ya existe como clave en el Map, se omite (no se vuelve a insertar).
      // Si el nombre no existe, se añade al Map.
      if (!uniqueCellsMap.has(cell.name)) {
        uniqueCellsMap.set(cell.name, cell);
      }
    }

    // Convertimos los valores del Map de nuevo a un array para usarlo en la UI.
    return Array.from(uniqueCellsMap.values());
  }
}
