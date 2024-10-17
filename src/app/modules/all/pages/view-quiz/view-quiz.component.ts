import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-quiz',
  templateUrl: './view-quiz.component.html',
  styleUrls: ['./view-quiz.component.scss'],
})
export class ViewQuizComponent implements OnInit {
  quizId: string = ''; // Para almacenar el ID del quiz
  quizDetails: any; // Aquí se guardarán los detalles del quiz

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Obtén el ID del quiz desde la ruta
    this.quizId = this.route.snapshot.paramMap.get('id') || '';

    // Llama al método para obtener detalles del quiz
    this.fetchQuizDetails();
  }

  async fetchQuizDetails() {
    try {
      const response = await fetch(`https://challenge-be-development-99e1.onrender.com/quiz/${this.quizId}`);
      if (response.ok) {
        this.quizDetails = await response.json();
      } else {
        console.error('Error al obtener detalles del quiz.');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }
}
