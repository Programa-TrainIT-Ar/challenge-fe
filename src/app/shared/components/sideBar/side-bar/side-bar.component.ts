import { Component, Input } from '@angular/core';

export type UserRole = 'admin' | 'candidate' | 'hr';

interface SidebarItem {
  icon: string;
  label: string;
  route?: string;
  type?: 'image' | 'icon';
}
@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  @Input() role: UserRole = 'admin';

  private adminItems: SidebarItem[] = [
    {
      icon: '../../../../../assets/demo/images/dos/Vector.png',
      label: 'Gestión Quizz',
      type: 'image'
    },
    {
      icon: '../../../../../assets/demo/images/tres/Vector.png',
      label: 'Gestión Challenge',
      type: 'image'
    },
    {
      icon: '../../../../../assets/demo/images/cuatro/Administrador/Crear Quizz/Vector.png',
      label: 'Gestionar Candidatos',
      type: 'image'
    },
    {
      icon: 'bi bi-trophy',
      label: 'Salir',
      type: 'icon'
    }
  ];

  private candidateItems: SidebarItem[] = [
    {
      icon: '../../../../../assets/demo/images/dos/Vector.png',
      label: 'Gestión Quizz',
      type: 'image'
    },
    {
      icon: '../../../../../assets/demo/images/tres/Vector.png',
      label: 'Gestión Challenge',
      type: 'image'
    },
    {
      icon: '../../../../../assets/demo/images/cuatro/Administrador/Crear Quizz/Vector.png',
      label: 'Gestionar Candidatos',
      type: 'image'
    },
    {
      icon: 'bi bi-trophy',
      label: 'Salir',
      type: 'icon'
    }
  ];
  // Método para obtener los items según el rol
  get sidebarItems(): SidebarItem[] {
    switch(this.role) {
      case 'admin': return this.adminItems;
      case 'candidate': return this.candidateItems;
      default: return [];
    }
  }
}

/* import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss'
})
export class SideBarComponent {
  isSidebarOpen = false;
  private authService: AuthService; 

  constructor(authService: AuthService) { 
    this.authService = authService; 
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.authService.logout().subscribe(() => {
      window.location.href = ''; 
    });
  }
} */