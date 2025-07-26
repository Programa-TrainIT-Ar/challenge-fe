import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrimaryBtnComponent } from './primary-btn.component';

describe('PrimaryBtnComponent', () => {
  let component: PrimaryBtnComponent;
  let fixture: ComponentFixture<PrimaryBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrimaryBtnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrimaryBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
