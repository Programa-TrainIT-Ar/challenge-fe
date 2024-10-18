import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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
  created_by: User;
  module: Module;
  cell: Cell;
  is_active: boolean;
}

@Component({
  selector: 'app-view-quiz',
  templateUrl: './view-quiz.component.html',
  styleUrls: ['./view-quiz.component.scss'],
})
export class ViewQuizComponent implements OnInit {
  quizId: string = ''; // Para almacenar el ID del quiz
  quizDetails: Quiz | null = null; // Aquí se guardarán los detalles del quiz usando la interfaz

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Obtén el ID del quiz desde la ruta
    this.quizId = this.route.snapshot.paramMap.get('id') || '';

    // Asegúrate de que el quizId no tenga comillas
    this.quizId = this.quizId.replace(/['"]+/g, '');

    console.log('ID del quiz sin comillas:', this.quizId); // Verifica si el ID es correcto

    // Llama al método para obtener detalles del quiz
    this.fetchQuizDetails();
  }

  async fetchQuizDetails() {
    try {
      console.log(`Realizando solicitud a la API con ID: ${this.quizId}`); // Log para verificar el endpoint
      const response = await fetch(`https://challenge-be-development-99e1.onrender.com/quiz/${this.quizId}`);
      if (response.ok) {
        const data: Quiz = await response.json();
        this.quizDetails = data;
        console.log('Detalles del quiz:', this.quizDetails); // Verifica si los datos son correctos
      } else {
        console.error('Error al obtener detalles del quiz, respuesta no OK.');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }
}
