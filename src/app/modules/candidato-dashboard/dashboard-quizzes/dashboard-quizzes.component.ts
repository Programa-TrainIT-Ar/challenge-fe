import { Component } from '@angular/core';
import { AllModule } from '../../all/all.module';

@Component({
  selector: 'app-dashboard-quizzes',
  standalone: true,
  imports: [AllModule],
  templateUrl: './dashboard-quizzes.component.html',
  styleUrl: './dashboard-quizzes.component.scss'
})
export class DashboardQuizzesComponent {

}
