import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { delay, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private http = inject(HttpClient);
  private urlApi: string = `${environment.url}/user`;

  constructor() {}

  registerUser(data: Object) {
    //descomentar la siguiente línea para que vuelva a funcionar la solicitud
    // return this.http.post(this.url, data);

    //eliminar lo siguiente
    const simulateSuccess = true;
    if (simulateSuccess) {
      console.log('SIMULACIÓN: Registro exitoso para datos:', data);
      return of({
        message:
          'Usuario registrado exitosamente. Correo de confirmación enviado.',
        userId: 'mock-user-123',
        email: (data as any).email,
      }).pipe(delay(1000));
    } else {
      console.error('SIMULACIÓN: Error en el registro para datos:', data);
      return throwError(
        () => new Error('Simulación: Error al procesar el registro.')
      );
    }
  }
}
