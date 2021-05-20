import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFirestore } from '@angular/fire/firestore';
import { SignUpComponent } from './sign-up.component';
import { Router } from '@angular/router';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  const aFireSpy = jasmine.createSpyObj('AngularFirestore',['']);
  const routerSpy = jasmine.createSpyObj('Router',['']);
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SignUpComponent ],
      providers:[{provide:AngularFirestore,useValue:aFireSpy},
      {provide:Router,useValue:routerSpy}]
    }).compileComponents();

  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
