import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerMenuComponent } from './buyer-menu.component';

fdescribe('BuyerMenuComponent', () => {
  let component: BuyerMenuComponent;
  let fixture: ComponentFixture<BuyerMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuyerMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
