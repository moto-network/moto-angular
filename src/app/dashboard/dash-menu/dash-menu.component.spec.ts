import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashMenuComponent  } from './dash-menu.component';

describe('ControlPanelComponent', () => {
  let component: DashMenuComponent;
  let fixture: ComponentFixture<DashMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
