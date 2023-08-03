import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDialogOverlayComponent } from './shared-dialog-overlay.component';

describe('SharedDialogOverlayComponent', () => {
  let component: SharedDialogOverlayComponent;
  let fixture: ComponentFixture<SharedDialogOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedDialogOverlayComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedDialogOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
