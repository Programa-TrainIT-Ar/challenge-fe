import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-google-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './google-btn.component.html',
  styleUrl: './google-btn.component.scss'
})
export class GoogleBtnComponent {
  @Input() buttonText: string = 'Continuar con Google'; // Texto por defecto
  
  @Output() googleClick = new EventEmitter<void>(); // Evento que emite al padre

  onGoogleClick(): void {
    this.googleClick.emit(); // Emite el evento al componente padre
  }
}
