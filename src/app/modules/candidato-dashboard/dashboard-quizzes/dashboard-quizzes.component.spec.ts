import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardQuizzesComponent } from './dashboard-quizzes.component';

describe('DashboardQuizzesComponent', () => {
  let component: DashboardQuizzesComponent;
  let fixture: ComponentFixture<DashboardQuizzesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardQuizzesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardQuizzesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
