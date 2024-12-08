import { Component } from '@angular/core';
import { SharedModule } from "../../shared/shared.module";
import { QuestionContainerComponent } from "../../shared/question-container/question-container.component";

@Component({
  selector: 'app-welcome-candidato',
  standalone: true,
  imports: [SharedModule, QuestionContainerComponent],
  templateUrl: './welcome-candidato.component.html',
  styleUrl: './welcome-candidato.component.scss'
})
export class WelcomeCandidatoComponent {

}
