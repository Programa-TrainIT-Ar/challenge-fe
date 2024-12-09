import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
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
        return throwError(error); // Retorna un observable de error
      })
    );
  }

  // Método para actualizar un cuestionario
  updateQuiz(id: string, quizData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/nested/${id}`, quizData).pipe(
      catchError(error => {
        console.error('Error al actualizar el cuestionario:', error);
        return throwError(error);
      })
    );
  }
}
// import { Injectable } from '@angular/core';
// import { HttpClient, HttpErrorResponse } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { environment } from '@environments/environment';
// import { catchError, map } from 'rxjs/operators';

// // Interface for type safety
// export interface QuizQuestion {
//   id?: string;
//   text: string;
//   type: 'multiple_choice' | 'simple_choice' | 'true_false';
//   correct_option: number[];
//   options: {
//     id?: number;
//     text: string;
//     selected: boolean;
//   }[];
// }

// export interface Quiz {
//   id?: string;
//   name: string;
//   description: string;
//   questions: QuizQuestion[];
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class QuizService {
//   private apiUrl = `${environment.url}/quiz`; 

//   constructor(private http: HttpClient) {}

//   // Get quiz with questions
//   getQuizWithQuestions(id: string): Observable<Quiz> {
//     return this.http.get<Quiz>(`${this.apiUrl}/${id}`).pipe(
//       catchError(this.handleError)
//     );
//   }

//   // Update quiz with full details, ensuring 10 questions
//   updateQuiz(id: string, quizData: Quiz): Observable<Quiz> {
//     // Validate that exactly 10 questions are present
//     if (quizData.questions.length !== 10) {
//       return throwError(() => new Error('Quiz must contain exactly 10 questions'));
//     }

//     // Normalize question data
//     const normalizedQuizData = {
//       ...quizData,
//       questions: quizData.questions.map(question => ({
//         ...question,
//         // Ensure correct_option is always an array
//         correct_option: Array.isArray(question.correct_option) 
//           ? question.correct_option 
//           : [question.correct_option],
//         // Normalize options
//         options: question.options.map((option, index) => ({
//           id: index,
//           text: option.text,
//           selected: question.correct_option.includes(index)
//         }))
//       }))
//     };

//     return this.http.put<Quiz>(`${this.apiUrl}/nested/${id}`, normalizedQuizData).pipe(
//       catchError(this.handleError)
//     );
//   }

//   // Centralized error handling
//   private handleError(error: HttpErrorResponse) {
//     let errorMessage = 'An unknown error occurred!';
    
//     if (error.error instanceof ErrorEvent) {
//       // Client-side error
//       errorMessage = `Error: ${error.error.message}`;
//     } else {
//       // Server-side error
//       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
//     }
    
//     console.error(errorMessage);
//     return throwError(() => new Error(errorMessage));
//   }
// }