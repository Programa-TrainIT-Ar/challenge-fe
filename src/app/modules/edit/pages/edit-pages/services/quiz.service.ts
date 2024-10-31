import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { tap, catchError } from 'rxjs/operators';

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
        return error(error);
      })
    );
  }

  // Método para actualizar un cuestionario
  updateQuiz(id: string, quizData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, quizData);
  }
}
