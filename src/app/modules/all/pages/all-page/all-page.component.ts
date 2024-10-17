import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

interface User {
  first_name: string;
}

interface Module {
  name: string;
}

interface Cell {
  name: string;
}

interface Quiz {
  id: string;
  name: string;
  seniority: string;
  created_at: string;
  created_by: User; // Cambiado a objeto
  module: Module; // Cambiado a objeto
  cell: Cell; // Cambiado a objeto
  is_active: boolean;
}

@Component({
  selector: 'app-all-page',
  templateUrl: './all-page.component.html',
  styleUrls: ['./all-page.component.scss'], // Cambiado a styleUrls para usar un array
})
export class AllPageComponent implements OnInit {
  searchText: string = ''; // Campo de búsqueda
  quizzes: Quiz[] = []; // Inicializa el array de quizzes
  selectedQuiz: Quiz | null = null; // Define selectedQuiz aquí

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Llama al método para obtener todos los quizzes al iniciar el componente
    this.fetchAllQuizzes();
  }

  // Método para obtener todos los quizzes desde la API
  async fetchAllQuizzes() {
    try {
      const response = await fetch(
        'https://challenge-be-development-99e1.onrender.com/quiz'
      );

      if (!response.ok) {
        // Verifica si la respuesta fue exitosa
        throw new Error('Error en la consulta: ' + response.status);
      }

      // Lee el cuerpo de la respuesta solo una vez
      const data = await response.json(); // Renombrado a 'data' para reflejar que es un objeto
      console.log('Datos recibidos de la API:', data); // Inspecciona la estructura de la respuesta

      // Asegúrate de que quizData es un array antes de asignarlo
      this.quizzes = Array.isArray(data.quizzes) ? data.quizzes : []; // Accede al array 'quizzes' dentro del objeto

      console.log('Quizzes recibidos:', this.quizzes);
    } catch (error) {
      // Manejo de errores
      console.error('Error al obtener los quizzes:', error);
    }
  }

  // Método para filtrar quizzes según el texto de búsqueda
  filteredQuizzes(): Quiz[] {
    const search = this.searchText.toLowerCase(); // Convertir a minúsculas para hacer la búsqueda insensible a mayúsculas/minúsculas

    // Retornar los quizzes filtrados
    return this.quizzes.filter(
      quiz =>
        quiz.name.toLowerCase().includes(search) ||
        quiz.seniority.toLowerCase().includes(search) ||
        quiz.created_at.toLowerCase().includes(search) || // fecha
        quiz.created_by.first_name.toLowerCase().includes(search) || // creador
        quiz.module.name.toLowerCase().includes(search) || //modulo
        quiz.cell.name.toLowerCase().includes(search) || //celula
        (quiz.is_active ? 'Activo' : 'Inactivo').toLowerCase().includes(search) // esta activo
    );
  }

  // Método para alternar el estado de is_active
  async toggleActive(quiz: Quiz) {
    quiz.is_active = !quiz.is_active; // Alterna el valor de is_active

    try {
      const response = await fetch(
        `https://challenge-be-development-99e1.onrender.com/quiz/${quiz.name}`,
        {
          // Asegúrate de usar un identificador correcto
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ is_active: quiz.is_active }), // Envía el nuevo estado
        }
      );

      if (!response.ok) {
        throw new Error(
          'Error al actualizar el estado del quiz: ' + response.status
        );
      }
    } catch (error) {
      console.error('Error al actualizar el estado del quiz:', error);
    }
  }

  // Método para ver los detalles de un quiz
  viewQuiz(quiz: Quiz) {
    this.selectedQuiz = quiz; // Establece el quiz seleccionado
    // Redirige a la ruta de visualización si es necesario
    this.router.navigate(['/view-quiz', quiz.id]); // Cambia según tu configuración de rutas
  }

  // Método para editar un quiz
  editQuiz(quiz: Quiz) {
    alert(`Editando el quiz: ${quiz.name}`);
    this.router.navigate(['/edit', quiz.name]); // Redirigir al editar usando el nombre del quiz
  }

  // Método para eliminar un quiz
  async deleteQuiz(quiz: any) {
    try {
      const result = await Swal.fire({
        title: '¿Deseas eliminar el registro?',
        text: 'Una vez eliminado no se podrá recuperar',        
        showCancelButton: true,
        confirmButtonColor: '#6c63ff', // Color del botón de confirmación
        cancelButtonColor: '#4e4e4e', // Color del botón de cancelación
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
        customClass: {
          popup: 'custom-popup',      // Clase para el fondo y bordes
          title: 'custom-title',      // Clase para el título
          confirmButton: 'custom-confirm-btn',  // Clase para el botón de confirmación
          cancelButton: 'custom-cancel-btn'     // Clase para el botón de cancelación
        }
      });
      ;
  
      if (result.isConfirmed) {
        let response = await fetch(
          `https://challenge-be-development-99e1.onrender.com/quiz/${quiz.id}`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );
  
        if (response.ok) {
          Swal.fire('Eliminado', 'El quiz ha sido eliminado.', 'success');
          this.quizzes = this.quizzes.filter(q => q !== quiz);
        } else {
          Swal.fire('Error', 'Hubo un error al eliminar el quiz.', 'error');
        }
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      Swal.fire('Error', 'Hubo un error en la solicitud.', 'error');
    }
  }
  
}
