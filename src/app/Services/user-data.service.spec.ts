import { TestBed } from '@angular/core/testing';
import {AngularFirestore} from '@angular/fire/firestore';
import { UserDataService } from './user-data.service';

describe('UserDataService', () => {
  let service: UserDataService;
 // let aFirestoreServiceSpy:jasmine.SpyObj<AngularFirestore>;
  const aFirestoreSpy = jasmine.createSpyObj('AngularFirestore',['collection']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[{provide:AngularFirestore,useValue:aFirestoreSpy}]
    });
    TestBed.inject(AngularFirestore)// as jasmine.SpyObj<AngularFirestore>;
    service = TestBed.inject(UserDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
