import { Component } from '@angular/core';

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
  styleUrl: './all-page.component.scss',
})
export class AllPageComponent {
  searchText: string = '';

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

  filteredQuizzes() {
    return this.quizzes.filter(quiz => 
      quiz.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
      quiz.creator.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  viewQuiz(quiz: Quiz) {
    alert(`Viendo el quiz: ${quiz.name}`);
  }

  editQuiz(quiz: Quiz) {
    alert(`Editando el quiz: ${quiz.name}`);
  }

  deleteQuiz(quiz: Quiz) {
    if (confirm(`¿Estás seguro de eliminar el quiz: ${quiz.name}?`)) {
      this.quizzes = this.quizzes.filter(q => q !== quiz);
    }
  }

}
