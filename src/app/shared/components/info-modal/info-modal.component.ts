import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
  OnInit,
} from '@angular/core';
import { BackgroundComponent } from '../background/background.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-info-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './info-modal.component.html',
  styleUrl: './info-modal.component.scss',
})
export class ModalComponent {
  @Output() closed = new EventEmitter<void>();
  @Input() showImage: boolean = true; // por defecto, la imagen central se muestra
  
  closeModal() {
    this.closed.emit();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent) {
    this.closeModal();
  }

}
