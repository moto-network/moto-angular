import { TestBed } from '@angular/core/testing';

import { ProductVerifierService } from './product-verifier.service';

describe('ProductVerifierService', () => {
  let service: ProductVerifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductVerifierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
