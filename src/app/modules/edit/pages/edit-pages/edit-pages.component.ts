import { Component } from '@angular/core';
import { trigger, style, transition, animate, state } from '@angular/animations';

@Component({
  selector: 'app-edit-pages',
  templateUrl: './edit-pages.component.html',
  styleUrl: './edit-pages.component.scss',
  animations: [
    trigger('enterState', [
      state('void', style({
        transform: 'translateX(-50%)',
      })),
      transition(':enter', [
        animate(300, style({
          transform: 'translateX(0)'
        }))
      ])
    ])
  ]
})
export class EditPagesComponent {}
