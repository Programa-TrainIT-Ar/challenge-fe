import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPageComponent } from './all-page.component';

describe('AllPageComponent', () => {
  let component: AllPageComponent;
  let fixture: ComponentFixture<AllPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
