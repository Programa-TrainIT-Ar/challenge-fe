import { Component, OnInit } from '@angular/core';
import { BackgroundBlackComponent } from 'src/app/shared/components/background-black/background-black.component';
import { SecundaryBtnComponent } from 'src/app/shared/components/secundary-btn/secundary-btn.component';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mail-confirmation',
  standalone: true,
  imports: [BackgroundBlackComponent, SecundaryBtnComponent, CommonModule],
  templateUrl: './mail-confirmation.component.html',
  styleUrl: './mail-confirmation.component.scss',
})
export class MailConfirmationComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  nameUser: string = '';
  isMailConfirmation: boolean = true;
  isPassConfirmation: boolean = false;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.nameUser = params['nameUser'] || 'Usuario';

      const typeConfirmation = params['type'];

      if (typeConfirmation === 'mail') {
        this.isMailConfirmation = true;
        this.isPassConfirmation = false;
      } else if (typeConfirmation === 'pass') {
        this.isMailConfirmation = false;
        this.isPassConfirmation = true;
      } else {
        this.isMailConfirmation = true;
        this.isPassConfirmation = false;
      }

    });
  }
}
