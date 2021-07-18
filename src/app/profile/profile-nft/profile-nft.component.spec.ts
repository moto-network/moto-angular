import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileNftComponent } from './profile-nft.component';

describe('ProfileNftComponent', () => {
  let component: ProfileNftComponent;
  let fixture: ComponentFixture<ProfileNftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileNftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileNftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
