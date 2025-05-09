import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AllPageService {
  
  private http = inject(HttpClient)
  private urlApi: string = `${environment.url}/quiz`
  
  constructor() { }

  getAllQuiz() {
    return this.http.get(this.urlApi)
  }

  getFilteredQuiz(filters: {
    module?: string;
    cell?: string;
    seniority?: string;
    search?: string;
  } = {}) {
    // Crear HttpParams
    let params = new HttpParams();
    
    if (filters.seniority) {
      params = params.append('seniority', filters.seniority);
    }
    if (filters.module) {
      params = params.append('module', filters.module);
    }
    if (filters.cell) {
      params = params.append('cell', filters.cell);
    }
    if (filters.search) {
      params = params.append('search', filters.search);
    }

    // Hacer la petición con los parámetros
    return this.http.get(this.urlApi, { params });
  }
  
  toggleIsActiveQuiz(id: string, is_active:boolean) {
    return this.http.put(`${this.urlApi}/${id}`, {is_active: is_active});
  }

  deleteQuiz(id: string) {
    return this.http.delete(`${this.urlApi}/${id}`)
  }
}

