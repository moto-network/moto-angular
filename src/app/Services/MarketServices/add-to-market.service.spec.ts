import { TestBed } from '@angular/core/testing';

import { AddToMarketService } from './add-to-market.service';

describe('AddToMarketService', () => {
  let service: AddToMarketService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddToMarketService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
