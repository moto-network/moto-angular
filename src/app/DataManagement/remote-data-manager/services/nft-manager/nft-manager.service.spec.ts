import { TestBed } from '@angular/core/testing';

import { NftManagerService } from './nft-manager.service';

describe('NftManagerService', () => {
  let service: NftManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NftManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
