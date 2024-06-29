import {Component, inject, OnInit, signal} from '@angular/core';
import {Observable} from 'rxjs';
import {UserService} from './UserService';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MenuModule} from 'primeng/menu';
import {TableModule} from 'primeng/table';
import {StyleClassModule} from 'primeng/styleclass';
import {PanelMenuModule} from 'primeng/panelmenu';
import {ButtonModule} from 'primeng/button';
import { AuthService } from '@auth0/auth0-angular';
import { NestjsApiService } from 'src/app/layout/service/nestjs-api.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
    templateUrl: './dashboard.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule, MenuModule, TableModule, StyleClassModule, PanelMenuModule, ButtonModule,],
})
export class DashboardComponent implements OnInit {
    userService = inject(UserService);
    nestjsService = inject(NestjsApiService)
    user$: Observable<unknown>;
    data = signal<any>([])
    constructor(public auth:AuthService, private http: HttpClient){}


        ngOnInit(): void {}

        callProtectedEndpoint(): void {
            if (this.auth.isAuthenticated$) {
                this.auth.getAccessTokenSilently().subscribe(
                  token => {
                    const headers = new HttpHeaders ({
                      Authorization: `Bearer ${token}`
                    });
                    this.nestjsService.getNestjs(headers).subscribe(
                      (response) => {
                        console.log('Respuesta del endpoint protegido:', response);
                      },
                      (error) => {
                        console.error('Error al llamar al endpoint protegido:', error);
                      }
                    );
                  },
                  error => {
                    console.error('Error obteniendo el access token:', error);
                  }
                );
              }
            }





}
