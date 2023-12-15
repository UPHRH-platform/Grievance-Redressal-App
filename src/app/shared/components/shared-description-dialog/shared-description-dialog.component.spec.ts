import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedDescriptionDialogComponent } from './shared-description-dialog.component';

describe('SharedDescriptionDialogComponent', () => {
  let component: SharedDescriptionDialogComponent;
  let fixture: ComponentFixture<SharedDescriptionDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedDescriptionDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedDescriptionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
