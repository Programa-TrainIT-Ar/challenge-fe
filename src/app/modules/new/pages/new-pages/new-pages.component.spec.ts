import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPagesComponent } from './new-pages.component';

describe('NewPagesComponent', () => {
  let component: NewPagesComponent;
  let fixture: ComponentFixture<NewPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewPagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NewPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
