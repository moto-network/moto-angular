import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindNftComponent } from './find-nft.component';

describe('FindNftComponent', () => {
  let component: FindNftComponent;
  let fixture: ComponentFixture<FindNftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindNftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindNftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
