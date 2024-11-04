import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopMessageComponent } from './pop-message.component';

describe('PopMessageComponent', () => {
  let component: PopMessageComponent;
  let fixture: ComponentFixture<PopMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopMessageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PopMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
