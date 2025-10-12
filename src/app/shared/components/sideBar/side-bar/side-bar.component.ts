import { Component, Input, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, DOCUMENT } from '@angular/common';
import { AuthService } from '@auth0/auth0-angular';
import { LocalAuthService } from 'src/app/modules/auth/local-auth.service';
export type UserRole = 'admin' | 'candidate' | 'hr';

interface SidebarItem {
  icon: string;
  label: string;
  route?: string;
  type?: 'image' | 'icon';
}
@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent {
  @Input() role: UserRole = 'admin';
  @Input() extended: boolean = true;
    @Input() blockNavigation: boolean = false;
    isSidebarOpen: boolean = true;

    constructor(
    private authService: AuthService,
    private router: Router,
    private localAuthService: LocalAuthService,
    @Inject(DOCUMENT) public document: Document
  ) {}

  private adminItems: SidebarItem[] = [
    {
      icon: '../../../../../assets/images/dos/Vector.png',
      label: 'Gestión Quizz',
      type: 'image',
    },
    {
      icon: '../../../../../assets/images/tres/Vector.png',
      label: 'Gestión Challenge',
      type: 'image',
    },
    {
      icon: '../../../../../assets/images/cuatro/Administrador/Crear Quizz/Vector.png',
      label: 'Gestionar Candidatos',
      type: 'image',
    },
  ];

  private candidateItems: SidebarItem[] = [
    {
      icon: '../../../../../assets/images/candidate/sidebar/inicio.png',
      label: 'Inicio',
      type: 'image',
      route: '/dashboard',
    },
    {
      icon: '../../../../../assets/images/candidate/sidebar/Challenge.png',
      label: 'Challenge',
      type: 'image',
      route: '/dashboard/quizzes',
    },
    {
      icon: '../../../../../assets/images/candidate/sidebar/MisChallenge.png',
      label: 'Mis Challenge',
      type: 'image',
    },
  ];
  // Método para obtener los items según el rol
  get sidebarItems(): SidebarItem[] {
    switch (this.role) {
      case 'admin':
        return this.adminItems;
      case 'candidate':
        return this.candidateItems;
      default:
        return [];
    }
  }

  toggleSidebar() {
    this.extended = !this.extended;
  }

  logout() {
    this.localAuthService.clearToken();
    this.authService.logout({
      logoutParams: {
        returnTo: this.document.location.origin,
      },
    });
  }

  /**
   * Navega a la ruta especificada por el item del sidebar en cada botón.
   * @param item El ítem del sidebar al que se hizo clic.
   */
  onItemClick(item: SidebarItem): void {
    if (item.route) {
      this.router.navigate([item.route]);
    }
  }
}
