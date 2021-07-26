import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageNftComponent } from './manage-nft.component';

describe('ManageNftComponent', () => {
  let component: ManageNftComponent;
  let fixture: ComponentFixture<ManageNftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageNftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageNftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
