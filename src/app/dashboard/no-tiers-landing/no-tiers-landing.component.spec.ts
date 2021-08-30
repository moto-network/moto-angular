import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoTiersLandingComponent } from './no-tiers-landing.component';

describe('NoTiersLandingComponent', () => {
  let component: NoTiersLandingComponent;
  let fixture: ComponentFixture<NoTiersLandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoTiersLandingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoTiersLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
