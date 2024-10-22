import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  isSidebarOpen = false;
  private authService: AuthService; // Add this line

  constructor(authService: AuthService) { 
    this.authService = authService; // Initialize the property here
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.authService.logout().subscribe(() => {
      window.location.href = ''; // Redirect to the login page
    });
  }
}