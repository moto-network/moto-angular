import { TestBed } from '@angular/core/testing';

import { AssetConverterService } from './asset-converter.service';

describe('AssetConverterService', () => {
  let service: AssetConverterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssetConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
