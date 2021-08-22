import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { TransactionsService} from "../Services/transactions.service"

describe('TransactionsService', () => {
  let service: TransactionsService;

  const aFireSpy = jasmine.createSpyObj('AngularFirestore',['']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers:[{provide:AngularFirestore,useValue:aFireSpy}]
    });
    service = TestBed.inject(TransactionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
