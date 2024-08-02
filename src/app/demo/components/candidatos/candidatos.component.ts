import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-candidatos',
  standalone: true,
  imports: [],
  templateUrl: './candidatos.component.html',
  styleUrl: './candidatos.component.scss'
})
export class CandidatosComponent {
  constructor(
    public layoutService: LayoutService,
    public el: ElementRef
  ) {}
}
