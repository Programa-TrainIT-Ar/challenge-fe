import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {debounceTime, Observable, Subscription} from 'rxjs';
import {LayoutService} from 'src/app/layout/service/app.layout.service';
import {UserService} from './UserService';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ChartModule} from 'primeng/chart';
import {MenuModule} from 'primeng/menu';
import {TableModule} from 'primeng/table';
import {StyleClassModule} from 'primeng/styleclass';
import {PanelMenuModule} from 'primeng/panelmenu';
import {ButtonModule} from 'primeng/button';

@Component({
    templateUrl: './dashboard.component.html',
    standalone: true,
    imports: [CommonModule, FormsModule, ChartModule, MenuModule, TableModule, StyleClassModule, PanelMenuModule, ButtonModule,],
})
export class DashboardComponent implements OnInit, OnDestroy {
    userService = inject(UserService);
    items!: MenuItem[];

    products!: unknown[];


    subscription!: Subscription;
    user$: Observable<unknown>;

    constructor(public layoutService: LayoutService) {
        this.subscription = this.layoutService.configUpdate$
            .pipe(debounceTime(25))
            .subscribe();
    }

    ngOnInit() {

        this.user$ = this.userService.getUser();

        this.items = [{label: 'Add New', icon: 'pi pi-fw pi-plus'}, {label: 'Remove', icon: 'pi pi-fw pi-minus'},];
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
