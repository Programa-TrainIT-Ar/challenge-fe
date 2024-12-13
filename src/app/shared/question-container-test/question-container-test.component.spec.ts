import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionContainerTestComponent } from './question-container-test.component';

describe('QuestionContainerTestComponent', () => {
  let component: QuestionContainerTestComponent;
  let fixture: ComponentFixture<QuestionContainerTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionContainerTestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionContainerTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
