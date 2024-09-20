import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  trigger,
  style,
  transition,
  animate,
  state,
} from '@angular/animations';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrl: './welcome-page.component.scss',
  animations: [
    trigger('expandState1', [
      state(
        'collapsed',
        style({
          display: 'none',
        })
      ),
      state(
        'expanded',
        style({
          maxWidth: '900px',
        })
      ),
      transition('collapsed => expanded', [animate('300ms ease-out')]),
      transition('expanded => collapsed', [animate('300ms ease-in')]),
    ]),
    trigger('expandState2', [
      state(
        'collapsed',
        style({
          width: "0px",
          
        })
      ),
      state(
        'expanded',
        style({
          maxWidth: '900px',
        })
      ),
      transition('collapsed => expanded', [animate('300ms ease-out')]),
      transition('expanded => collapsed', [animate('300ms ease-in')]),
    ]),
    trigger('expandState3', [
      state(
        'collapsed',
        style({
          display: 'none',
        })
      ),
      state(
        'expanded',
        style({
          maxWidth: '900px',
        })
      ),
      transition('collapsed => expanded', [animate('300ms ease-out')]),
      transition('expanded => collapsed', [animate('300ms ease-in')]),
    ]),
  ],
})
export class WelcomePageComponent {
  constructor(private router: Router) {}
  isExpanded1 = false;
  isExpanded2 = false;
  isExpanded3 = false;

  toggleExpand1() {
    this.isExpanded1 = !this.isExpanded1;
    this.isExpanded2 = false;
    this.isExpanded3 = false;
  }

  toggleExpand2() {
    this.isExpanded2 = !this.isExpanded2;
    this.isExpanded1 = false;
    this.isExpanded3 = false;
  }

  toggleExpand3() {
    this.isExpanded1 = !this.isExpanded3;
    this.isExpanded2 = false;
    this.isExpanded3 = false;
  }
  goToAll() {
    this.router.navigate(['/all']);
  }
  goToCreate() {
    this.router.navigate(['/create']);
  }
  goToEdit() {
    this.router.navigate(['/edit']);
  }
}
