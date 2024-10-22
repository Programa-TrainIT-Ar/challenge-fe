import { Component } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent {
  constructor(private auth: AuthService, private router: Router) {}

  login() {
    this.auth.loginWithPopup().subscribe({
      next: () => {
        this.auth.user$.subscribe(usuario => {
          console.log('Usuario:', usuario); 
          if (usuario) {
            const roles = usuario['https://miaplicacion.com/roles'];
            console.log('Roles:', roles); 
            if (!roles || !roles.includes('admin')) {
              const userData = {
                email: usuario.email,
                first_name: usuario.given_name,
                last_name: usuario.family_name,
                photo: usuario.picture,
                phone_number: '', 
                timezone: '', 
                gender: '', 
                password: 'defaultPassword', 
              };

              fetch(`${environment.url}/user`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
              }).then(response => {
                if (response.ok) {
                  console.log('Usuario registrado exitosamente');
                  this.handleUserRedirection(usuario);
                } else {
                  response.json().then(data => {
                    if (data.user) {
                      this.handleUserRedirection(data.user);
                    } else {
                      console.error('Error al registrar el usuario');
                    }
                  });
                }
              }).catch(error => {
                console.error('Error en la solicitud:', error);
              });
            } else {
              this.router.navigate(['/home']);
            }
          }
        });
      },
      error: (error) => {
        console.error('Error en el inicio de sesión:', error);
      }
    });
  }

  private handleUserRedirection(user: any) {
    const roles = user['https://miaplicacion.com/roles']; 
    if (roles && roles.includes('admin')) {
      this.router.navigate(['/home']); 
    } else {
      this.router.navigate(['/sign-in']);
    }
  }
}
