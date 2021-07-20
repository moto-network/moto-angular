import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayNFTComponent } from './display-nft.component';

describe('ProfileNftComponent', () => {
  let component: DisplayNFTComponent;
  let fixture: ComponentFixture<DisplayNFTComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayNFTComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayNFTComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
