import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleMessageDialogComponent } from './simple-message-dialog.component';

describe('UniversalDialogComponent', () => {
  let component: SimpleMessageDialogComponent;
  let fixture: ComponentFixture<SimpleMessageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleMessageDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
