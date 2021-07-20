import { TestBed } from '@angular/core/testing';

import { ChinaDataService } from './china-data.service';

describe('ChinaDataService', () => {
  let service: ChinaDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChinaDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
