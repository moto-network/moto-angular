import { TestBed } from '@angular/core/testing';

import { NFTManagerService } from './manage-nft.service';

describe('CreateNftService', () => {
  let service: NFTManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NFTManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
