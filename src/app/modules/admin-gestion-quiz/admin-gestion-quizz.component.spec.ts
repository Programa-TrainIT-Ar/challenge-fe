import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminGestionQuizModule } from './admin-gestion-quiz.module';



describe('AdminGestionQuizzComponent', () => {
  let component: AdminGestionQuizModule;
  let fixture: ComponentFixture<AdminGestionQuizModule>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminGestionQuizModule]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AdminGestionQuizModule);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
