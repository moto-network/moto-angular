import { TestBed } from '@angular/core/testing';

import { OnlyAccountGuard } from './only-account.guard';

describe('OnlyOwnerGuard', () => {
  let guard: OnlyAccountGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OnlyAccountGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
