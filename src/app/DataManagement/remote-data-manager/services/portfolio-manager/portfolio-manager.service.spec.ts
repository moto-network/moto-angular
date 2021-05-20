import { ComponentFactoryResolver } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { PortfolioManagerService } from './portfolio-manager.service';

describe('PortfolioManagerService', () => {
  let service: PortfolioManagerService;

  beforeEach(() => {
    const aFireSpy = jasmine.createSpyObj('AngularFirestore',['']);
    TestBed.configureTestingModule({
      providers:[{provide:AngularFirestore,useValue:aFireSpy}]
    });
    service = TestBed.inject(PortfolioManagerService);
  });

  it('should be created', () => {
    console.log("portfolio is ",service);
    expect(service).toBeTruthy();
  });
});
