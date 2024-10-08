import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Quiz {
  name: string;
  seniority: string;  
  created_at: string;
  created_by:string
  module: string;
  cell: string;
  is_active: string;
}

@Component({
  selector: 'app-all-page',
  templateUrl: './all-page.component.html',
  styleUrls: ['./all-page.component.scss'], // Cambiado a styleUrls para usar un array
})
export class AllPageComponent implements OnInit {
  searchText: string = '';  // Campo de búsqueda
  quizzes: Quiz[] = [];  // Inicializa el array de quizzes
  

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Llama al método para obtener todos los quizzes al iniciar el componente
    this.fetchAllQuizzes();
  }

  // Método para obtener todos los quizzes desde la API
async fetchAllQuizzes() {
  try {
      const response = await fetch('https://challenge-be-development-99e1.onrender.com/quiz');

      if (!response.ok) { // Verifica si la respuesta fue exitosa
          throw new Error('Error en la consulta: ' + response.status);
      }

      // Lee el cuerpo de la respuesta solo una vez
      const data = await response.json(); // Renombrado a 'data' para reflejar que es un objeto
      console.log("Datos recibidos de la API:", data); // Inspecciona la estructura de la respuesta

      // Asegúrate de que quizData es un array antes de asignarlo
      this.quizzes = Array.isArray(data.quizzes) ? data.quizzes : []; // Accede al array 'quizzes' dentro del objeto

      console.log("Quizzes recibidos:", this.quizzes);
      
  } catch (error) {
      // Manejo de errores
      console.error("Error al obtener los quizzes:", error);
  }
}



  // Método para filtrar quizzes según el texto de búsqueda
  filteredQuizzes(): Quiz[]  {
    const search = this.searchText.toLowerCase(); // Convertir a minúsculas para hacer la búsqueda insensible a mayúsculas/minúsculas

    // Retornar los quizzes filtrados
    return this.quizzes.filter(quiz => 
      quiz.name.toLowerCase().includes(search) || 
      quiz.seniority.toLowerCase().includes(search) || 
      quiz.created_at.toLowerCase().includes(search) ||  // fecha 
      quiz.created_by.toLowerCase().includes(search) ||
      quiz.module.toLowerCase().includes(search) ||  //modulo
      quiz.cell.toLowerCase().includes(search) ||  
      quiz.is_active.toLowerCase().includes(search)
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
