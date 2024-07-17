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
import { ChallengeComponent } from '../challenge/challenge.component';
import { Header } from 'primeng/api';
import { tick } from '@angular/core/testing';
import { Token } from '@angular/compiler';
import Swal from 'sweetalert2';

@Component({
    templateUrl: './dashboard.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule, MenuModule, TableModule, StyleClassModule, PanelMenuModule, ButtonModule,ChallengeComponent],
})
export class DashboardComponent implements OnInit {
    // [x: string]: import("@auth0/auth0-angular").User;
    userService = inject(UserService);
    nestjsService = inject(NestjsApiService)
    headers = new HttpHeaders
    user: import("@auth0/auth0-angular").User;
    constructor(public auth:AuthService, private http: HttpClient){}


        // ngOnInit(): void {
        //     this.auth.isAuthenticated$.subscribe(isAuthenticated=>{
        //         if (isAuthenticated) {
        //             this.auth.getAccessTokenSilently().subscribe(
        //                 token => {
        //                   const headers = new HttpHeaders ({
        //                     Authorization: `Bearer ${token}`
        //                   });
        //                   this.nestjsService.portUser(headers,this.user,).subscribe(
        //                     (response) => {
        //                       console.log('Respuesta del endpoint protegido:', response);
        //                       console.log(token);

        //                     },
        //                     (error) => {
        //                       console.error('Error al llamar al endpoint protegido:', error);
        //                     }
        //                   );
        //                 },
        //                 error => {
        //                   console.error('Error obteniendo el access token:', error);
        //                 }
        //               );

        //         }
        //     })
        // }

        ngOnInit() {
            this.auth.isAuthenticated$.subscribe(isAuth => {
                if (isAuth) {
                    this.userRegister()
                }
            })
        }

        async userRegister() {

            await this.auth.user$.subscribe({
                next: data => {
                this.user = {
                    "name" : data.name,
                    "nickname" : data.nickname,
                    "email" : data.email,
                    "picture" : data.picture
                }
                this.auth.getAccessTokenSilently().subscribe({
                    next: token => {
                        this.headers = new HttpHeaders ({
                            Authorization: `Bearer ${token}`
                        })

                    this.nestjsService.portUser(this.user, this.headers).subscribe({
                        next : res => {
                        return Swal.fire({
                            title: '¡Registro Exitoso!',
                            text: `Bienvenido a TrainIT ${this.user.name}`,
                            icon: 'success',
                            confirmButtonText: 'Aceptar'
                        })
                    } , error: (error => {
                        return console.log("Error al registrar el usuario: ", error.error.message);

                    })
                })
                    }, error: (error => {
                        return console.log("Error al obtener token", error);

                    })
                })

            }, error: (error =>{
                return console.log("Error al obtener inf del usuario", error);
            })
        })


        }

        // callProtectedEndpoint(): void {
        //     this.auth.isAuthenticated$.subscribe(isAuthenticated  => {
        //         if (isAuthenticated) {
        //             this.auth.getAccessTokenSilently().subscribe(
        //               token => {
        //                 const headers = new HttpHeaders ({
        //                   Authorization: `Bearer ${token}`
        //                 });

        //                 this.nestjsService.getNestjs(headers).subscribe(
        //                   (response) => {
        //                     console.log('Respuesta del endpoint protegido:', response);
        //                     console.log(token);

        //                   },
        //                   (error) => {
        //                     console.error('Error al llamar al endpoint protegido:', error);
        //                   }
        //                 );
        //               },
        //               error => {
        //                 console.error('Error obteniendo el access token:', error);
        //               }
        //             );
        //           }
        //     })

        // }





}
