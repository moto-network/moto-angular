import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { BitcoinService } from './bitcoin.service';
import {Observable, of} from 'rxjs';
describe('BitcoinService', () => {
  let service: BitcoinService;

  beforeEach(() => {
    const httpSpy = jasmine.createSpyObj('HttpClient',['get']);
    httpSpy.get.and.returnValue(of({'price':123123}))
    TestBed.configureTestingModule({
      providers:[{provide:HttpClient,useValue:httpSpy}]
    });
    service = TestBed.inject(BitcoinService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getBTCPrice should return observable',()=>{
    console.log(typeof of(""));
    service.getBTCPrice()?.subscribe(
      (value)=>{
        expect(value).not.toBe(undefined);
      }
    );
    expect()
  });
});
