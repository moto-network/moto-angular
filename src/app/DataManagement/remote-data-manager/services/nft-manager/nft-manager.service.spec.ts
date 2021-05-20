import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { NftManagerService } from './nft-manager.service';

describe('NftManagerService', () => {
  let service: NftManagerService;
  const aFireSpy = jasmine.createSpyObj('AngularFirestore',['']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[{provide:AngularFirestore,useValue:aFireSpy}]
    });
    service = TestBed.inject(NftManagerService);
  });

  it('should be created', () => {
    console.log("this service is ", service);
    expect(service).toBeTruthy();
  });
});
