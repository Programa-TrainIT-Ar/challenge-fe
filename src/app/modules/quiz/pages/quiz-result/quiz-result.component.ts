import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { BlueButtonComponent } from 'src/app/shared/components/blue-button/blue-button.component';

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
  imports: [CommonModule, BlueButtonComponent, SharedModule],
  templateUrl: './quiz-result.component.html',
  styleUrl: './quiz-result.component.scss'
})
export class QuizResultComponent {
  router = inject(Router);

  @Input() result: ChallengeResult = {
    id: "1",
    calification: 2,
    time_taken: 15,
  }

  @Input() quizName: string = '';
  @Input() totalQuestions: number = 10;

  formatTime(seconds: number): string {
    if (!seconds) return '0:00';
    
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
}