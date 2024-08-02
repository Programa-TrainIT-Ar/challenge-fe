import { CandidatosComponent } from '../candidatos/candidatos.component';
import { ChallengeRatingComponent } from '../challenge-rating/challenge-rating.component';
import { ChallengeComponent } from '../challenge/challenge.component';
import { DashboardComponent } from './dashboard.component';

export const DASHBOARD_ROUTES = [
    { path: '', component: CandidatosComponent },
    { path: 'dashboard', component: DashboardComponent },
    { path: 'candidatos', component: CandidatosComponent },
    { path: 'challenge', component: ChallengeComponent },
    { path: 'calificar', component: ChallengeRatingComponent },
     
  ];
