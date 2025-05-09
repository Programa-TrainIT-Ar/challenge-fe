import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

  private http = inject(HttpClient)
  private urlApi: string = `${environment.url}/quiz`

  getQuiz(id:string) {
    return this.http.get(`${this.urlApi}/${id}`)
  }
}
