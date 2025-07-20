import { TestBed } from '@angular/core/testing';

import { CandidatoSignUpService } from './sign-up.service';

describe('CandidatoSignUpService', () => {
  let service: CandidatoSignUpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidatoSignUpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
