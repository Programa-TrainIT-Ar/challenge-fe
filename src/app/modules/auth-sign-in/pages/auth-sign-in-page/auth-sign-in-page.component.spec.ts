import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthSignInPageComponent } from './auth-sign-in-page.component';

describe('AuthSignInPageComponent', () => {
  let component: AuthSignInPageComponent;
  let fixture: ComponentFixture<AuthSignInPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthSignInPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AuthSignInPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
