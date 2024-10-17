import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewQuizComponent } from './view-quiz.component';

describe('ViewQuizComponent', () => {
  let component: ViewQuizComponent;
  let fixture: ComponentFixture<ViewQuizComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewQuizComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
