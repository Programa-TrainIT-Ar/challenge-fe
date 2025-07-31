import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

export interface UserData {
  email: string;
  first_name?: string;
  last_name?: string;
  photo?: string;
  phone_number?: string;
  timezone?: string;
  gender?: string;
  password?: string;
  birthdate?: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private urlApi = `${environment.url}/user`;

  constructor(private http: HttpClient) {}

  finduserByEmail(email: string) {
    return this.http.get(`${this.urlApi}/FindByEmail?email=${email}`);
  }

  loginWithEmail(email: string, password: string) {
    return this.http.post(`${this.urlApi}/login`, { email, password });
  }

  sendResetLink(email: string) {
    return this.http.post(`${this.urlApi}/forgot-password`, { email });
  }

  registerUser(userData: UserData) {
    return this.http.post(`${this.urlApi}/register`, userData);
  }
}
