import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { catchError, of, throwError } from 'rxjs';

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

export interface LoginResponse {
  access_token: string;
  scope: string;
  token_type: string;
  expires_in: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private urlApi = `${environment.url}/user`;

  constructor(private http: HttpClient) {}

  finduserByEmail(email: string) {
    return this.http.get<UserData>(`${this.urlApi}/FindByEmail?email=${email}`).pipe(
      catchError(error => {
        if (error.status === 404) {
          return of(null);
        }
        throw Error ;
    })
    );
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

  registerUserWithAuth(userData: UserData) {
    return this.http.post(`${this.urlApi}/register-with-auth`, userData);
  }

  accountSetup(id, userData: UserData){
    return this.http.put(`${this.urlApi}/${id}`, userData);
  }

  sentEmailVerification(email: string , first_name: string) {
    return this.http.post(`${this.urlApi}/send-email-confirmation`, { email, first_name });
  }

  VerifyEmail(token: string) {
    return this.http.post(`${this.urlApi}/confirm-email`, { token });
  }
}
