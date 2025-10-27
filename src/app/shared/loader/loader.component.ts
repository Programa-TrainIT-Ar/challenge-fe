import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss'
})
export class LoaderComponent {
  //Variable para controlar la visibilidad del loader
  isVisible: boolean = true;

  //Inyecta el servicio LoaderService para controlar el estado del loader
  constructor(private loaderService: LoaderService) {
    //Se suscribe al observable loading$ del servicio para actualizar isVisible
    this.loaderService.loading$.subscribe((loading) => {
      this.isVisible = loading;
    });
  }


}
