import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environments/environment';

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
  questions: Question[];
}

interface Question {
  id: string;
  question: string;
  options: string[];
  correct_option: number[];
  explanation: string;
  link: string;
  type: string;
  is_active: boolean;
}

@Component({
  selector: 'app-view-quiz',
  templateUrl: './view-quiz.component.html',
  styleUrls: ['./view-quiz.component.scss'],
})
export class ViewQuizComponent implements OnInit {
  quizId: string = '';
  quizDetails: Quiz | null = null;

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
    this.quizId = this.route.snapshot.paramMap.get('id') || '';
    this.quizId = this.quizId.replace(/['"]+/g, '');
    console.log('ID del quiz sin comillas:', this.quizId);
    this.fetchQuizDetails();
  }

  async fetchQuizDetails() {
    try {
      console.log(`Realizando solicitud a la API con ID: ${this.quizId}`); 
      const response = await fetch(`${environment.url}/quiz/${this.quizId}`);
      if (response.ok) {
        const data: Quiz = await response.json();
        this.quizDetails = data;
        console.log('Detalles del quiz:', this.quizDetails);
      } else {
        console.error('Error al obtener detalles del quiz, respuesta no OK.');
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  }

  /* goBack(): void {
    this.location.back();
  } */
}
