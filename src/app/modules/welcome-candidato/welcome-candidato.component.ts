import { Component } from '@angular/core';
import { SharedModule } from "../../shared/shared.module";
import { QuestionContainerComponent } from "../../shared/question-container/question-container.component";
import { BlueButtonComponent } from 'src/app/shared/components/blue-button/blue-button.component';

@Component({
  selector: 'app-welcome-candidato',
  standalone: true,
  imports: [SharedModule, QuestionContainerComponent, BlueButtonComponent],
  templateUrl: './welcome-candidato.component.html',
  styleUrl: './welcome-candidato.component.scss'
})
export class WelcomeCandidatoComponent {
  step: number = 1;

  nextStep() {
    this.step ++;
  }
}
