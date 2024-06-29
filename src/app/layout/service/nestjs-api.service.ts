import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class NestjsApiService {
    private http = inject(HttpClient)
    private urlApi: string = "http://localhost:3000"

  constructor() { }

    getNestjs(headers) {
        return this.http.get(`${this.urlApi}/protected`, {headers})
    }

}
