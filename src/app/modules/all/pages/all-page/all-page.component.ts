import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Quiz {
  name: string;
  seniority: string;
  creationDate: string;
  creator: string;
  module: string;
  cell: string;
  status: string;
}

@Component({
  selector: 'app-all-page',
  templateUrl: './all-page.component.html',
  styleUrls: ['./all-page.component.scss'], // Cambiado a styleUrls para usar un array
})
export class AllPageComponent {
  searchText: string = '';  // Campo de búsqueda
  quizzes: Quiz[] = [
    { name: 'UI Jr Quiz', seniority: 'Junior', creationDate: '30/08/2024', creator: 'Oscar A.', module: 'Desarrollo', cell: 'Diseño UX/UI', status: 'Activo' },
    { name: 'QA Sr Quiz', seniority: 'Senior', creationDate: '30/08/2024', creator: 'Thamy G.', module: 'Desarrollo', cell: 'QA', status: 'Activo' },
    { name: 'FS Trainee Quiz', seniority: 'Trainee', creationDate: '30/08/2024', creator: 'Javier B.', module: 'Desarrollo', cell: 'Back End', status: 'Activo' },
    { name: 'FS Jr Quiz', seniority: 'Junior', creationDate: '30/08/2024', creator: 'Brayan C.', module: 'Desarrollo', cell: 'Back End', status: 'Activo' },
    { name: 'Diseñador Jr.', seniority: 'Junior', creationDate: '30/08/2024', creator: 'Rafael B.', module: 'Marketing', cell: 'Diseño', status: 'Activo' },
    { name: 'BE Trainee Quiz', seniority: 'Trainee', creationDate: '30/08/2024', creator: 'Brayan C.', module: 'Sistemas', cell: 'Python', status: 'Activo' },
    { name: 'BE Jr Quiz', seniority: 'Junior', creationDate: '30/08/2024', creator: 'Brayan C.', module: 'Sistemas', cell: 'Python', status: 'Activo' },
    { name: 'UI Jr Quiz 1', seniority: 'Junior', creationDate: '30/08/2024', creator: 'Oscar A.', module: 'Desarrollo', cell: 'Diseño UX/UI', status: 'Activo' }
  ];

  constructor(private router: Router) { }

  // Método para filtrar quizzes según el texto de búsqueda
  filteredQuizzes(): Quiz[] {
    const search = this.searchText.toLowerCase(); // Convertir a minúsculas para hacer la búsqueda insensible a mayúsculas/minúsculas

    // Retornar los quizzes filtrados
    return this.quizzes.filter(quiz => 
      quiz.name.toLowerCase().includes(search) || 
      quiz.seniority.toLowerCase().includes(search) || 
      quiz.creator.toLowerCase().includes(search) || 
      quiz.module.toLowerCase().includes(search) || 
      quiz.cell.toLowerCase().includes(search) || 
      quiz.status.toLowerCase().includes(search)
    );
  }

  // Método para ver los detalles de un quiz
  viewQuiz(quiz: Quiz) {
    alert(`Viendo el quiz: ${quiz.name}`);
  }

  // Método para editar un quiz
  editQuiz(quiz: Quiz) {
    alert(`Editando el quiz: ${quiz.name}`);
    this.router.navigate(['/edit', quiz.name]);  // Redirigir al editar usando el nombre del quiz
  }

  // Método para eliminar un quiz
  deleteQuiz(quiz: Quiz) {
    if (confirm(`¿Estás seguro de eliminar el quiz: ${quiz.name}?`)) {
      // Eliminar el quiz del array
      this.quizzes = this.quizzes.filter(q => q !== quiz);
    }
  }
}
