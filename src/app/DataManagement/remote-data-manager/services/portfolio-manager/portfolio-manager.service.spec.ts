import { TestBed } from '@angular/core/testing';

import { PortfolioManagerService } from './portfolio-manager.service';

describe('PortfolioManagerService', () => {
  let service: PortfolioManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PortfolioManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
