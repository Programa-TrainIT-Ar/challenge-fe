import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  // Método genérico para mostrar alertas
  private showAlert(
    title: string, 
    text: string, 
    icon: SweetAlertIcon, 
    confirmButtonText: string = 'Aceptar'
  ) {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      confirmButtonText: confirmButtonText,
      customClass: {
        popup: 'custom-delete-popup',
        title: 'custom-delete-title',
        confirmButton: 'custom-delete-confirm-button',
      },
      buttonsStyling: false
    });
  }

  // Método para mostrar alertas de error
  showError(message: string, title: string = 'Error') {
    this.showAlert(title, message, 'error');
  }

  // Método para mostrar alertas de éxito
  showSuccess(message: string, title: string = 'Éxito') {
    this.showAlert(title, message, 'success');
  }

  // Método para mostrar alertas de advertencia
  showWarning(message: string, title: string = 'Advertencia') {
    this.showAlert(title, message, 'warning');
  }

  // Método para confirmaciones
  showConfirm(
    title: string, 
    text: string, 
    onConfirm: () => void, 
    confirmButtonText: string = 'Confirmar',
    cancelButtonText: string = 'Cancelar'
  ) {
    Swal.fire({
      title: title,
      text: text,
      icon: 'question',
      showCloseButton: true,
      showCancelButton: false,
      confirmButtonText: confirmButtonText,
      customClass: {
        popup: 'custom-delete-popup',
        title: 'custom-delete-title',
        confirmButton: 'custom-delete-confirm-button',
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm();
      }
    });
  }

  // Método para alertas con entrada de texto
  showPrompt(
    title: string, 
    text: string, 
    onConfirm: (value: string) => void
  ) {
    Swal.fire({
      title: title,
      text: text,
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'my-custom-popup-class',
        title: 'my-custom-title-class',
        htmlContainer: 'my-custom-text-class',
        confirmButton: 'btn btn-primary me-2',
        cancelButton: 'btn btn-secondary'
      },
      buttonsStyling: false
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        onConfirm(result.value);
      }
    });
  }
}