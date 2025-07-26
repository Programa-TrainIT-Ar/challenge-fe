import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-primary-btn',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './primary-btn.component.html',
  styleUrl: './primary-btn.component.scss'
})
export class PrimaryBtnComponent {

  @Input() buttonText: string = 'Entrar'; // Texto por defecto
  @Input() disabled: boolean = true; // Propiedad para deshabilitar el botón
  @Output() submit = new EventEmitter<void>(); // Evento que emite al padre
  
  onSubmit(): void {
    this.submit.emit(); // Emite el evento al componente padre
}
}