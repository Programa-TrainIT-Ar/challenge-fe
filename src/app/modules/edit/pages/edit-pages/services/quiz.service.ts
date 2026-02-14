import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import { tap, catchError } from 'rxjs/operators';
import {
  ResponseQuestion,
  UpdateQuizRequest,
} from '../../../../../shared/question-container/question-interface';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private apiUrl = `${environment.url}/quiz`; // Cambia esto por tu URL real

  constructor(private http: HttpClient) {}

  // Método para obtener un cuestionario con sus preguntas
  getQuizWithQuestions(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`).pipe(
      tap(response => console.log('Respuesta de la API:', response)),
      catchError(error => {
        console.error('Error al obtener el cuestionario:', error);
        return throwError(error); // Retorna un observable de error
      })
    );
  }

  // Método para actualizar un cuestionario
  updateQuiz(id: string, quizData: UpdateQuizRequest): Observable<any> {
    return this.http.put(`${this.apiUrl}/nested/${id}`, quizData).pipe(
      catchError(error => {
        console.error('Error al actualizar el cuestionario:', error);
        return throwError(error);
      })
    );
  }


}
