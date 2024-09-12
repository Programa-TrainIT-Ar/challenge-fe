import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';

@Injectable({
  providedIn: 'root'
})

export class NestjsApiService {
    private http = inject(HttpClient)
    private urlApi: string = "http://localhost:3000"

  constructor(private auth : AuthService) { }

    getNestjs(headers) {
        return this.http.get(`${this.urlApi}/protected`, {headers})
    }

    portUser(user, headers) {
        return this.http.post(`${this.urlApi}/user`,user, {headers})
    }



}
