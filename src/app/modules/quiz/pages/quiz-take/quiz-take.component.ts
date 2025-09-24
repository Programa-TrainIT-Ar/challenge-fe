import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from './quiz-take.service'; // Crea este servicio
import { QuestionContainerComponent } from 'src/app/shared/question-container/question-container.component';
import { BlueButtonComponent } from 'src/app/shared/components/blue-button/blue-button.component';
import { SharedModule } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-take',
  standalone: true,
  templateUrl: './quiz-take.component.html',
  styleUrls: ['./quiz-take.component.scss'],
  imports: [
    CommonModule, 
    QuestionContainerComponent,
    BlueButtonComponent,
    SharedModule
  ]
})
export class QuizTakeComponent implements OnInit {
  step = 1;
  countdown = 5;
  quizId: string = '';
  quiz: any = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService
  ) {}

  ngOnInit() {
    this.quizId = this.route.snapshot.paramMap.get('id') || '';
    if (this.quizId) {
      this.loadQuiz();
    } else {
      this.router.navigate(['/']); // Redirige si no hay ID
    }
  }

  loadQuiz() {
    this.quizService.getQuizById(this.quizId).subscribe({
      next: (quiz) => {
        this.quiz = quiz;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading quiz:', error);
        this.router.navigate(['/']); // Redirige si hay error
      }
    });
  }

  nextStep() {
    if (this.step < 4) {
      this.step++;
      if (this.step === 3) {
        this.startCountdown();
      }
    }
  }

  startCountdown() {
    const interval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        clearInterval(interval);
        this.nextStep();
      }
    }, 1000);
  }
}
