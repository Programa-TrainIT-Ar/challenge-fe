import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideBarComponent } from 'src/app/shared/components/sideBar/side-bar/side-bar.component';

@Component({
  selector: 'app-dashboard-page',
  standalone: true, // AGREGADO
  imports: [CommonModule, SideBarComponent, RouterOutlet ], // AGREGADO
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
