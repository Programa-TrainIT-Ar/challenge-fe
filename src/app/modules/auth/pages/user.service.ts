import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { delay, of, throwError } from 'rxjs';

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
    //descomentar la siguiente línea para que funcione la solicitud
    // return this.http.post(`${this.urlApi}/forgot-password`, { email });

    //borrar lo siguiente
    const simulateSuccess = true;
    if (simulateSuccess) {
      console.log('SIMULACIÓN: Registro exitoso para datos:', email);
      return of({
        message:
          'Usuario registrado exitosamente. Correo de confirmación enviado.',
        userId: 'mock-user-123',
        email: (email as any).email,
      }).pipe(delay(1000));
    } else {
      console.error('SIMULACIÓN: Error en el registro para datos:', email);
      return throwError(
        () => new Error('Simulación: Error al procesar el registro.')
      );
    }
  }

  registerUser(userData: UserData) {
    return this.http.post(`${this.urlApi}/register`, userData);
  }
}
