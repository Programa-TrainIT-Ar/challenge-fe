import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NewPageService {
  
  private http = inject(HttpClient)
  private urlApi: string = `${environment.url}`
  
  constructor() { }

  findUserByEmail(email: string) {
    return this.http.get(`${this.urlApi}/user/FindByEmail?email=${email}`)
  }
}