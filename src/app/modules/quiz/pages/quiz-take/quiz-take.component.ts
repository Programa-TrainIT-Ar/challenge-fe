import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { QuizService } from './quiz-take.service';
import { QuestionContainerComponent } from 'src/app/shared/question-container/question-container.component';
import { BlueButtonComponent } from 'src/app/shared/components/blue-button/blue-button.component';
import { SideBarComponent } from 'src/app/shared/components/sideBar/side-bar/side-bar.component';
import { Quiz } from 'src/app/shared/question-container/question-interface';
import { CanComponentDeactivate } from './unsaved-changes.guard';
import { QuizResultComponent } from '../../pages/quiz-result/quiz-result.component';

@Component({
  selector: 'app-quiz-take',
  standalone: true,
  templateUrl: './quiz-take.component.html',
  styleUrls: ['./quiz-take.component.scss'],
  imports: [
    CommonModule,
    QuestionContainerComponent,
    BlueButtonComponent,
    SideBarComponent,
    QuizResultComponent
  ]
})

export class QuizTakeComponent implements OnInit, OnDestroy, CanComponentDeactivate {
  private destroy$ = new Subject<void>();

  step = 1;
  countdown = 5;
  quiz: Quiz | null = null;
  loading = true;
  private countdownInterval?: ReturnType<typeof setInterval>;

  quizStarted = false;

  quizResults: any = null;

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
    if (this.step < 5) {
      this.step++;
      if (this.step === 3) {
        this.startCountdown();
      }
    } else if (this.step === 5) {
      this.router.navigate(['/dashboard']);
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

  @HostListener('window:beforeunload', ['$event'])
  canDeactivate(): boolean {
    return !this.quizStarted;
  }
  onQuizStarted(isStarted: boolean): void {
    this.quizStarted = isStarted;
  }

  onShowResults(resultsData: any): void {
      this.quizStarted = false;
    this.quizResults = resultsData.challengeResult;
    console.log('📊 Mostrando resultados:', this.quizResults);

    this.step = 5;
  }
}
