import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-blue-button',
  standalone: true,
  imports: [],
  templateUrl: './blue-button.component.html',
  styleUrl: './blue-button.component.scss'
})
export class BlueButtonComponent {
  @Input() text: string = "Button";
  @Output() onClick = new EventEmitter<void>();

  handleClick() {
    this.onClick.emit();
  }
}
