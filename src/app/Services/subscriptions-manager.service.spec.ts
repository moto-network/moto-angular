import { TestBed } from '@angular/core/testing';

import { SubscriptionsManagerService } from './subscriptions-manager.service';

describe('SubscriptionsManagerService', () => {
  let service: SubscriptionsManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubscriptionsManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
