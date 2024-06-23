import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from './UserService';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { StyleClassModule } from 'primeng/styleclass';
import { PanelMenuModule } from 'primeng/panelmenu';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  templateUrl: './dashboard.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MenuModule,
    TableModule,
    StyleClassModule,
    PanelMenuModule,
    ButtonModule,
  ],
})
export class DashboardComponent implements OnInit {
  userService = inject(UserService);
  user$: Observable<unknown>;

  ngOnInit() {
    this.user$ = this.userService.getUserById('clxdtn52v0008c2a7hrx9tsj6');
    console.log(this.user$);
  }
  constructor(public auth: AuthService) {}
}
