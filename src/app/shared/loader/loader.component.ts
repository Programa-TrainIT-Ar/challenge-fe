/**
 * Componente encargado de mostrar u ocultar la animación de carga (loader)
 * según el estado proporcionado por el `LoaderService`.
 */
import { Component , ChangeDetectorRef} from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent {
  //Variable para controlar la visibilidad del loader
  isVisible: boolean = true;

  //Inyecta el servicio LoaderService para controlar el estado del loader
  constructor(private loaderService: LoaderService, private cdr: ChangeDetectorRef) {
    //Se suscribe al observable loading$ del servicio para actualizar isVisible
    this.loaderService.loading$.subscribe((loading) => {
      this.isVisible = loading;
      this.cdr.detectChanges(); // Forzar la detección de cambios
    });
  }

}
