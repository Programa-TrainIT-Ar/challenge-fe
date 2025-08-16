import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BackgroundComponent } from "src/app/shared/components/background/background.component";
import { BlueButtonComponent } from "src/app/shared/components/blue-button/blue-button.component";

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [BackgroundComponent, BlueButtonComponent],
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss'
})
export class ErrorComponent {

  constructor(private router: Router){}

  text: string = 'Ir al home';

  navigateTo() {
    this.router.navigate(['/register']);
  }


}
