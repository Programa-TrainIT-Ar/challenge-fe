import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { Module } from './header-page.interface';
import { catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderPageService {

  private http = inject(HttpClient)
  private urlApi: string = environment.url

  constructor() { }
  getModules(){
    return this.http.get<Module[]>(`${this.urlApi}/modules`)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  
  createModule(name:string) {
    return this.http.post(`${this.urlApi}/modules`, {name: name})
    .pipe(
      catchError(this.errorHandler)
    )
  }

  deleteModule(id: string) {
    return this.http.delete(`${this.urlApi}/modules/${id}`)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  updateModule(id: string, name:string) {
    return this.http.put(`${this.urlApi}/modules/${id}`, {name: name})
    .pipe(
      catchError(this.errorHandler)
    )
  }

  createCell(name:string, module_id:string) {
    return this.http.post(`${this.urlApi}/cells`, {
      name: name,
      module_id: module_id
    })
    .pipe(
      catchError(this.errorHandler)
    )
  }

  deleteCell(id: string) {
    return this.http.delete(`${this.urlApi}/cells/${id}`)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  updateCell(id: string, name:string) {
    return this.http.put(`${this.urlApi}/cells/${id}`, {
      name: name,
    })
    
  }
  
  errorHandler(error: HttpErrorResponse) {
    let errorMessage = '';
    
    if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente (por ejemplo, red, sintaxis, etc.)
        errorMessage = `Error del cliente: ${error.error.message}`;
    } else {
        // Error del lado del servidor (código de estado, respuesta del backend)
        errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
        
        // Opcional: Información adicional del error del servidor
        if (error.error && error.error.details) {
            errorMessage += `\nDetalles: ${error.error.details}`;
        }
    }

    console.error('Error completo:', error);
    
    // Puedes personalizar más el manejo de errores específicos
    switch (error.status) {
        case 401:
            // Manejar error de autorización
            break;
        case 403:
            // Manejar error de permisos
            break;
        case 404:
            // Manejar recurso no encontrado
            break;
        case 500:
            // Manejar error interno del servidor
            break;
    }

    // Devolver un Observable de error para que pueda ser manejado en el componente
    return throwError(() => new Error(errorMessage));
}
}
