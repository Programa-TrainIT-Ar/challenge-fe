import { Component, OnInit, Output, EventEmitter, Input, output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@environments/environment';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { QuizService } from '../../../edit/pages/edit-pages/services/quiz.service'; // Importa el servicio

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
  quizDetails: Quiz | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Quiz>();
  @Output() delete = new EventEmitter<Quiz>();
  @Input() quizId: string = ''; // Recibe el ID del quiz como un Input

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private router: Router,
    private quizService: QuizService // Inyectamos el servicio
  ) {}

  ngOnInit(): void {
    // Usar quizId desde el Input en vez de la ruta
    console.log('Quiz ID recibido en view-quiz:', this.quizId);
    if (this.quizId) {
      this.fetchQuizDetails(); // Llamar al método para obtener los detalles del quiz
    }
  }

  fetchQuizDetails() {
    this.quizService.getQuizWithQuestions(this.quizId).subscribe(
      (data: Quiz) => {
        this.quizDetails = data;
        console.log('Detalles del quiz:', this.quizDetails); // Verifica los datos del quiz
      },
      error => {
        console.error('Error al obtener los detalles del quiz:', error);
      }
    );
  }
  deleteQuiz(){
    if (this.quizDetails) {
      this.delete.emit(this.quizDetails);
      this.close.emit();
    }
  }

  editQuiz() {
    if (this.quizDetails) {
      this.edit.emit(this.quizDetails);
      this.close.emit();
    }
  }

  goBack(): void {
    this.close.emit();
  }
}
