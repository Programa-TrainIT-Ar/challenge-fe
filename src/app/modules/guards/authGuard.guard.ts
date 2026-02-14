import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "@auth0/auth0-angular";
import { map, Observable } from "rxjs";
import { LocalAuthService } from "../auth/local-auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private auth: AuthService,
    private localAuth: LocalAuthService,
    private router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.auth.isAuthenticated$.pipe(
      map(isAuth0 => {
        if (isAuth0 || this.localAuth.isAuthenticated()) {
          return true;
        }
        this.router.navigate(['/login']);
        return false;
      })
    );
  }
}