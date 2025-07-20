import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SignUpService {
  private http = inject(HttpClient);
  private urlApi: string = `${environment.url}/user`;

  constructor() {}

  registerUser(data: Object) {
    return this.http.post(this.urlApi + "/register", data);
  }
}
