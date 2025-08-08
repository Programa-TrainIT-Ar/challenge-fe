import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { delay, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountSetupService {
  private http = inject(HttpClient);
  private urlApi: string = `${environment.url}/user`;

  constructor() {}

  registerUser(data: Object) {
    return this.http.post(this.urlApi, data);
  }
}
