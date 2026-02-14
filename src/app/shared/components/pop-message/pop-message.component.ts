import { Component, Input,Output, EventEmitter  } from '@angular/core';

@Component({
  selector: 'app-pop-message',
  templateUrl: './pop-message.component.html',
  styleUrl: './pop-message.component.scss'
})
export class PopMessageComponent {
@Input() message: string 
@Output() closeEvent = new EventEmitter<void>();

close() {
  this.closeEvent.emit(); 
}
}
