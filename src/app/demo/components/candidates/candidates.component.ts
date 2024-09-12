import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-candidates',
  standalone: true,
  imports: [],
  templateUrl: './candidates.component.html',
  styleUrl: './candidates.component.scss'
})
export class CandidatesComponent {
  constructor(
    public layoutService: LayoutService,
    public el: ElementRef
  ) {}
}
