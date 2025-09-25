import { TestBed } from '@angular/core/testing';

import { DashboardCardsService } from './dashboard-cards.service';

describe('DashboardCardsService', () => {
  let service: DashboardCardsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DashboardCardsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
