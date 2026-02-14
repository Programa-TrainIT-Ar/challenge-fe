import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blue-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blue-button.component.html',
  styleUrl: './blue-button.component.scss'
})
export class BlueButtonComponent {
  @Input() text: string = "Button";
  @Input() disabled: boolean = false; // AGREGADO
  @Output() onClick = new EventEmitter<void>();

  handleClick() {
    if (!this.disabled) { // AGREGADO - solo emite si no está deshabilitado
      this.onClick.emit();
    }
  }
}
