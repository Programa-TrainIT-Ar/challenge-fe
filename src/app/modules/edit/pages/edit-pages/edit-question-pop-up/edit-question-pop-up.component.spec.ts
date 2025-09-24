import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditQuestionPopUpComponent } from './edit-question-pop-up.component';

describe('EditQuestionPopUpComponent', () => {
  let component: EditQuestionPopUpComponent;
  let fixture: ComponentFixture<EditQuestionPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditQuestionPopUpComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditQuestionPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
