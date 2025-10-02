import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { QuizService } from './quiz-take.service';
import { QuestionContainerComponent } from 'src/app/shared/question-container/question-container.component';
import { BlueButtonComponent } from 'src/app/shared/components/blue-button/blue-button.component';
import { SideBarComponent } from 'src/app/shared/components/sideBar/side-bar/side-bar.component';
import { Quiz } from 'src/app/shared/question-container/question-interface';

@Component({
  selector: 'app-quiz-take',
  standalone: true,
  templateUrl: './quiz-take.component.html',
  styleUrls: ['./quiz-take.component.scss'],
  imports: [
    CommonModule,
    QuestionContainerComponent,
    BlueButtonComponent,
    SideBarComponent
  ]
})
export class QuizTakeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  step = 1;
  countdown = 5;
  quiz: Quiz | null = null;
  loading = true;
  private countdownInterval?: ReturnType<typeof setInterval>;

  // Variables para registro de tiempo
  private quizStartTime?: Date;
  private totalTimeSpent = 0; // en segundos

  // Variable para manejar si el quiz ha comenzado
    quizStarted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService
  ) {}

  ngOnInit(): void {
    const quizId = this.route.snapshot.paramMap.get('id');
    if (quizId) {
      this.loadQuiz(quizId);
    } else {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private loadQuiz(quizId: string): void {
    this.quizService.getQuizById(quizId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (quiz) => {
          this.quiz = quiz;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading quiz:', error);
          this.router.navigate(['/']);
        }
      });
  }

  nextStep(): void {
    if (this.step < 4) {
      this.step++;
      if (this.step === 3) {
        this.startCountdown();
      } else if (this.step === 4) {
        // Iniciar el timer cuando comience el quiz real
        this.startQuizTimer();
      }
    }
  }

  private startCountdown(): void {
    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown === 0) {
        if (this.countdownInterval) {
          clearInterval(this.countdownInterval);
        }
        this.nextStep();
      }
    }, 1000);
  }

  private startQuizTimer(): void {
    this.quizStartTime = new Date();
  }

  // Método público para obtener el tiempo transcurrido
  getTimeSpent(): number {
    if (!this.quizStartTime) return 0;
    return Math.floor((new Date().getTime() - this.quizStartTime.getTime()) / 1000);
  }

  // Método público para cuando se complete el quiz
  onQuizCompleted(): void {
    this.totalTimeSpent = this.getTimeSpent();
    console.log(`Quiz completado en ${this.totalTimeSpent} segundos`);
  }
  onQuizStarted(isStarted : boolean): void {
      this.quizStarted = isStarted;
  }

}
