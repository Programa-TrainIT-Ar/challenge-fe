import { Component, AfterViewInit } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AuthService } from '@auth0/auth0-angular';
import { SideBarComponent } from 'src/app/shared/components/sideBar/side-bar/side-bar.component';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-home-page',
  standalone: true, 
  imports: [CommonModule, SideBarComponent, RouterOutlet], 
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements AfterViewInit{
  user$ = this.auth.user$ 
  isMessageHidden = false;
  activeSection = 'Todos'; // Sección activa por defecto

  constructor(private auth: AuthService) {}

  setActiveSection(section: string) {
    this.activeSection = section;
  }
  ngAfterViewInit() {
    
    const welcomeElement = document.getElementById('welcome');
    
    if (welcomeElement) {
      
      fromEvent(welcomeElement, 'click')
        .pipe(debounceTime(200)) 
        .subscribe(() => {
          this.isMessageHidden = true;
        });

      
      const routerOutlet = welcomeElement.querySelector('router-outlet');
      if (routerOutlet) {
        
        const observer = new MutationObserver(() => {
          this.isMessageHidden = true;
        });

        observer.observe(routerOutlet, {
          childList: true,
          subtree: true
        });
      }
    }
  }
}
