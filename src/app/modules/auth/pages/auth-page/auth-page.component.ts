import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.scss']
})
export class AuthPageComponent implements OnInit {
  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit() {
    this.handleRedirectCallback(); // Maneja la redirección después del inicio de sesión
  }

  login() {
    this.auth.loginWithRedirect(); // Cambiado a redirección
  }

  private handleRedirectCallback() {
    this.auth.user$.subscribe(usuario => {
      if (usuario) {
        console.log('Usuario:', usuario);
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

        // Registro del usuario siempre, independientemente del rol! :)
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
                console.log('Usuario encontrado:', data.user);
                this.handleUserRedirection(data.user);
              } else {
                console.error('Error al registrar el usuario');
              }
            });
          }
        }).catch(error => {
          console.error('Error en la solicitud:', error);
        });
      }else{
        console.log('No hay usuario autenticado.');
      }
    });
  }
//redireccionamiento
  private handleUserRedirection(user: any) {
    const roles = user['https://miaplicacion.com/roles']; 
    if (roles && roles.includes('admin')) {
      this.router.navigate(['/home']); 
    } else {
      this.router.navigate(['/sign-in']);
    }
  }
}
