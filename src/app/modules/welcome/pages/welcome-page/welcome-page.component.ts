import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss',
})
export class WelcomePageComponent {
  constructor(private router: Router) {}

  goToAll() {
    this.router.navigate(['/all']);
  }
  goToCreate() {
    this.router.navigate(['/create']);
  }
  goToEdit() {
    this.router.navigate(['/edit']);
  }
}
