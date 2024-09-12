import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChallengeRatingComponent } from './challenge-rating.component';

describe('ChallengeRatingComponent', () => {
  let component: ChallengeRatingComponent;
  let fixture: ComponentFixture<ChallengeRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChallengeRatingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChallengeRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
