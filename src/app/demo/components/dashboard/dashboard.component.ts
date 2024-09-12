import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '@auth0/auth0-angular';
import { UserService } from './UserService'; 
import Swal from 'sweetalert2';
import { switchMap, catchError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { ChallengeComponent } from '../challenge/challenge.component';

@Component({
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MenuModule,
    TableModule,
    StyleClassModule,
    PanelMenuModule,
    ButtonModule,
    ChallengeComponent
  ],
})
export class DashboardComponent implements OnInit {
  user: any;
  hasAccess: boolean = false; 

  constructor(
    public auth: AuthService,
    private http: HttpClient,
    private userService: UserService 
  ) {}

  ngOnInit() {
    this.auth.isAuthenticated$.pipe(
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          // Manejo si no está autenticado
          this.hasAccess = false;
          return of(null); // Termina el observable
        }

        // Si está autenticado, obtener el usuario y verificar el rol
        return this.auth.user$.pipe(
          switchMap(user => {
            this.user = {
              name: user.name,
              nickname: user.nickname,
              email: user.email,
              picture: user.picture
            };

            return this.auth.getAccessTokenSilently().pipe(
              switchMap(token => {
                const headers = new HttpHeaders({
                  Authorization: `Bearer ${token}`
                });

                return this.userService.getUserRole(user.sub, headers).pipe(
                  switchMap(role => {
                    this.hasAccess = role === 'user';
                    if (!this.hasAccess) {
                      Swal.fire({
                        title: 'Acceso Denegado',
                        text: 'No tienes permisos para acceder a esta área.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                      });
                    }
                    return of(null); // Termina el observable
                  }),
                  catchError(error => {
                    console.error("Error al obtener el rol del usuario", error);
                    Swal.fire({
                      title: 'Error',
                      text: 'Hubo un problema al verificar tu rol.',
                      icon: 'error',
                      confirmButtonText: 'Aceptar'
                    });
                    return of(null); // Termina el observable en caso de error
                  })
                );
              })
            );
          })
        );
      })
    ).subscribe();
  }
}
