import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlueButtonComponent } from 'src/app/shared/components/blue-button/blue-button.component';
import { SideBarComponent } from 'src/app/shared/components/sideBar/side-bar/side-bar.component';

interface ChallengeResult {
  id: string;
  calification: number;
  time_taken: number;
  question_answers?: number[];
  created_at?: number,
  updated_at?: number,
  quiz_id?: string;
  user_id?: string;
}
@Component({
  selector: 'app-quiz-result',
  standalone: true,
  imports: [CommonModule, BlueButtonComponent, SharedModule, SideBarComponent],
  templateUrl: './quiz-result.component.html',
  styleUrl: './quiz-result.component.scss'
})

export class QuizResultComponent {
 
  private router = inject(Router);
 
  //ejemplo, darle a la variable result el valor del input que trae router
  result: ChallengeResult = {
    id: "1",
    calification: 2,
    time_taken: 15,
   
}

redirectToHome(): void{
    this.router.navigate(['dashboard']);
}

}