import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private http = inject(HttpClient)
  private urlApi: string = `${environment.url}`

  getQuizById(id: string): Observable<any> {
    return this.http.get(`${this.urlApi}/quiz/take/${id}`);
  }
  
  submitQuizAnswers(quizId: string, answers: any[]): Observable<any> {
    return this.http.post(`${this.urlApi}/quiz/take/${quizId}/submit`, {
      quizId,
      answers 
    });
  }
}
