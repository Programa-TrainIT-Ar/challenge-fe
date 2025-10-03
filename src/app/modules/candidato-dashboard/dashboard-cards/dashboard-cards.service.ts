import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DashboardCardsService {
  private urlApi: string = `${environment.url}/cells`;

  constructor(private http: HttpClient) {}

  getAllActiveCellsWithQuizzes() {
    //Buscar todas las células existentes que estén activas
    let params = new HttpParams().set('is_active', 'true').set('has_quizzes', 'true');
    return this.http.get(this.urlApi, { params: params });
  }
}
