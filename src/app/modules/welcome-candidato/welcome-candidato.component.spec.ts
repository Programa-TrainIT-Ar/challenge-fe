import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeCandidatoComponent } from './welcome-candidato.component';

describe('WelcomeCandidatoComponent', () => {
  let component: WelcomeCandidatoComponent;
  let fixture: ComponentFixture<WelcomeCandidatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeCandidatoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WelcomeCandidatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
