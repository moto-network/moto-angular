import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { BitcoinService } from './bitcoin.service';

describe('BitcoinService', () => {
  let service: BitcoinService;

  beforeEach(() => {
    const httpSpy = jasmine.createSpyObj('HttpClient',['get']);

    TestBed.configureTestingModule({
      providers:[{provide:HttpClient,useValue:httpSpy}]
    });
    service = TestBed.inject(BitcoinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
