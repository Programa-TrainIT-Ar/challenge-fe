import { Component } from '@angular/core';
import { SharedModule } from "../../shared/shared.module";
import { QuestionContainerComponent } from "../../shared/question-container/question-container.component";
import { BlueButtonComponent } from 'src/app/shared/components/blue-button/blue-button.component';

@Component({
  selector: 'app-welcome-candidato',
  standalone: true,
  imports: [SharedModule, QuestionContainerComponent, BlueButtonComponent],
  templateUrl: './welcome-candidato.component.html',
  styleUrls: ['./welcome-candidato.component.scss']
})
export class WelcomeCandidatoComponent {
  step: number = 1;
  countdown: number = 10; 
  intervalId!: any; 

  nextStep() {
    this.step++;

    if (this.step === 3) {
      this.startCountdown();
    }
  }

  private startCountdown() {
    this.intervalId = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.intervalId);
        this.step++; 
      }
    }, 1000);
  }
}
