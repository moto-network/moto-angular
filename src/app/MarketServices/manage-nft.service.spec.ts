import { TestBed } from '@angular/core/testing';

import { ManageNFTService } from './manage-nft.service';

describe('CreateNftService', () => {
  let service: ManageNFTService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageNFTService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
