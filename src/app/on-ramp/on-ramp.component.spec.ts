import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnRampComponent } from './on-ramp.component';

describe('OnRampComponent', () => {
  let component: OnRampComponent;
  let fixture: ComponentFixture<OnRampComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnRampComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnRampComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
