import { TestBed } from '@angular/core/testing';
import { HttpClient,HttpHeaders, HttpParams } from '@angular/common/http';
import { AssetConverterService } from './asset-converter.service';

describe('AssetConverterService', () => {
  let service: AssetConverterService;
  let HttpClientSpy:jasmine.SpyObj<HttpClient>;
  beforeEach(() => {
    const httpSpy = jasmine.createSpyObj('HttpClient',['']);
    TestBed.configureTestingModule({
      providers:[{
        provide:HttpClient,useValue:httpSpy
      }]
    });
    HttpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
    service = TestBed.inject(AssetConverterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
