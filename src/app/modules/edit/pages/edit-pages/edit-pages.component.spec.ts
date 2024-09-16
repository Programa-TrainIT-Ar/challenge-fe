import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPagesComponent } from './edit-pages.component';

describe('EditPagesComponent', () => {
  let component: EditPagesComponent;
  let fixture: ComponentFixture<EditPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPagesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
