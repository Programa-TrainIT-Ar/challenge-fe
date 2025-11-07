// Servicio responsable de controlar la visibilidad del loader
// (animación de carga) en toda la aplicación Angular.
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
/**
   * BehaviorSubject mantiene un valor actual y notifica a todos cuando este cambia.
   *
   * En este caso, se usa para representar el estado del loader:
   * - true  → mostrar loader
   * - false → ocultar loader
   *
   * Se inicializa en "false" para que el loader esté oculto por defecto.
   */
private loading = new BehaviorSubject<boolean>(false);

  /**
   * Observable público derivado del BehaviorSubject.
   *
   * Se expone como observable de solo lectura mediante .asObservable()
   * para evitar que otros componentes puedan modificar su valor directamente.
   * 
   * Convención: el sufijo `$` indica que esta propiedad es un Observable.
   */
loading$ = this.loading.asObservable();

 /**
   * Muestra el loader en pantalla.
   * 
   * Cambia el estado del BehaviorSubject a "true",
   * notificando a los componentes que deben mostrar el loader.
   */

show(): void {
  this.loading.next(true);
}

/**
   * Oculta el loader en pantalla.
   * 
   * Cambia el estado del BehaviorSubject a "false",
   * notificando a los componentes que deben ocultar el loader.
   */

hide(): void {
  this.loading.next(false); 
}
}