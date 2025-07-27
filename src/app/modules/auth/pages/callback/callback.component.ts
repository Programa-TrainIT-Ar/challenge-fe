import { Component, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [],
  template: '', 
  styleUrl: './callback.component.scss'
})
export class CallbackComponent implements OnInit {
  
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log('🔄 Iniciando callback de Auth0...');
    console.log('🌐 URL actual:', window.location.href);
    console.log('🔗 URL params:', window.location.search);
    
    // ✅ Usar switchMap para evitar suscripciones anidadas
    this.auth.handleRedirectCallback().pipe(
      switchMap((result) => {
        console.log('✅ Redirección manejada exitosamente:', result);
        return this.auth.user$;
      }),
      catchError((error) => {
        console.error('❌ Error al manejar la redirección:', error);
        
        // ✅ Manejo específico para "Invalid state"
        if (error.message && error.message.includes('Invalid state')) {
          console.log('🧹 Error de estado inválido, verificando autenticación...');
          
          // Verificar si el usuario ya está autenticado a pesar del error
          return this.auth.isAuthenticated$.pipe(
            switchMap(isAuth => {
              if (isAuth) {
                console.log('✅ Usuario ya autenticado, obteniendo datos...');
                return this.auth.user$;
              } else {
                console.log('❌ Usuario no autenticado');
                this.router.navigate(['/login']);
                return of(null);
              }
            })
          );
        } else {
          this.router.navigate(['/login']);
          return of(null);
        }
      })
    ).subscribe({
      next: (user) => {
        if (user) {
          console.log('👤 Usuario completo:', user);
          console.log('🔑 Propiedades disponibles:', Object.keys(user));
          
          // ✅ Verificar múltiples posibles ubicaciones de roles
          const roles = user['https://miaplicacion.com/roles'] || 
                       user['app_metadata']?.roles || 
                       user['user_metadata']?.roles ||
                       user['https://your-domain.com/roles'] ||
                       [];
          
          console.log('🎭 Roles del usuario:', roles);
          
          if (Array.isArray(roles) && roles.includes('admin')) {
            console.log('🏠 Redirigiendo a /home (admin)');
            this.router.navigate(['/home']);
          } else {
            console.log('👥 Redirigiendo a /candidato');
            this.router.navigate(['/candidato']);
          }
        }
      },
      error: (finalError) => {
        console.error('❌ Error final:', finalError);
        this.router.navigate(['/login']);
      }
    });
  }
}