import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';

export interface CanComponentDeactivate {
  // The component must implement this method.
  canDeactivate: () => boolean;
}
/**
 * 🚨 UnsavedChangesGuard
 * Este guard evita que el usuario navegue fuera de una ruta
 * si el componente indica que hay trabajo en curso o no guardado.
 */
@Injectable({
  providedIn: 'root'
})
export class UnsavedChangesGuard implements CanDeactivate<CanComponentDeactivate> {

  /**
   * Determina si se puede desactivar el componente.
   * @param component El componente de destino que implementa CanComponentDeactivate.
   */
  canDeactivate(component: CanComponentDeactivate): boolean {
    // Llama al método canDeactivate() del componente.
    const canExit = component.canDeactivate();

    if (canExit) {
      // Si el componente devuelve 'true', permite la navegación.
      return true;
    } else {
      // Si el componente devuelve 'false' (ej. this.quizStarted es true),
      // muestra una alerta al usuario.
      // 🚨 El 'HostListener' que pusiste maneja el evento 'window:beforeunload'.
      // Para la navegación de Angular, este 'confirm' es el estándar.
      return confirm('⚠️ Tienes un cuestionario en curso. ¿Estás seguro de que quieres abandonar la página? Se perderá el progreso.');
    }
  }
}
