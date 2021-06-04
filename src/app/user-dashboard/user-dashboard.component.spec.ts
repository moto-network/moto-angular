import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PortfolioManagerService } from '../Services/portfolio-manager.service';
import { UserDashboardComponent } from './user-dashboard.component';
import {of} from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
describe('UserDashboardComponent', () => {
  let component: UserDashboardComponent;
  let fixture: ComponentFixture<UserDashboardComponent>;
  let pmServiceSpy:jasmine.SpyObj<PortfolioManagerService>;

  class MockAngularFirestore{
    collection(something:string):string{
      return "test";
    }
  }
  const collectionStub = {
    valueChanges: jasmine.createSpy('valueChanges').and.returnValue({"dummy":"data"})
  }
  
  const angularFirestoreStub = {
    collection: jasmine.createSpy('collection').and.returnValue(collectionStub)
  }
  beforeEach(async () => {
    const pmSpy = jasmine.createSpyObj('PortfolioManagerService',['getPortfolio']);
    const stub = {
      data:()=>{}
    }
    pmSpy.getPortfolio.and.returnValue(of({docs:[stub]}))
    await TestBed.configureTestingModule({
      declarations: [ UserDashboardComponent ],
      providers:[{provide:PortfolioManagerService, useValue:pmSpy},{provide:AngularFirestore,useValue:angularFirestoreStub}]
    })
    .compileComponents();
  });

  beforeEach(() => {

    fixture = TestBed.createComponent(UserDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
