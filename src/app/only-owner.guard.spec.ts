import { TestBed } from '@angular/core/testing';

import { OnlyOwnerGuard } from './only-owner.guard';

describe('OnlyOwnerGuard', () => {
  let guard: OnlyOwnerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OnlyOwnerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
