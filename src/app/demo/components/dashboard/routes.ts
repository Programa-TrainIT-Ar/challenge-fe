import { CandidatesComponent } from '../candidates/candidates.component';
import { ChallengeRatingComponent } from '../challenge-rating/challenge-rating.component';
import { ChallengeComponent } from '../challenge/challenge.component';
import { DashboardComponent } from './dashboard.component';

export const DASHBOARD_ROUTES = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: 'candidatos',
        component: CandidatesComponent,
      },
      {
        path: 'challenge',
        component: ChallengeComponent,
      },
      {
        path: 'challenge-rating',
        component: ChallengeRatingComponent,
      },
    ],
  },
];
