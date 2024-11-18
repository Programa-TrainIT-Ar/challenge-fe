import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HeaderPageService {

  private http = inject(HttpClient)
  private urlApi: string = `${environment.url}/modules`

  constructor() { }
  getModules(){
    return this.http.get(this.urlApi)
  }

}
