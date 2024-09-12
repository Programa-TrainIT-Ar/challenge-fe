import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://api.example.com'; // Cambia esto a la URL de tu API

  constructor(private http: HttpClient) {}

  getUserRole(userId: string, headers: HttpHeaders): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/users/${userId}/role`, { headers });
  }
}
