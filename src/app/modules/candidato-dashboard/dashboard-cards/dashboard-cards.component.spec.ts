import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCardsComponent } from './dashboard-cards.component';

describe('DashboardCardsComponent', () => {
  let component: DashboardCardsComponent;
  let fixture: ComponentFixture<DashboardCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCardsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DashboardCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
