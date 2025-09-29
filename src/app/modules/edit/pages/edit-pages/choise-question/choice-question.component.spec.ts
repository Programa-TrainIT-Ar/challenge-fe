import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChoiceQuestionComponent } from './choice-question.component';

describe('ChoiseQuestionComponent', () => {
  let component: ChoiceQuestionComponent;
  let fixture: ComponentFixture<ChoiceQuestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChoiceQuestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChoiceQuestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
