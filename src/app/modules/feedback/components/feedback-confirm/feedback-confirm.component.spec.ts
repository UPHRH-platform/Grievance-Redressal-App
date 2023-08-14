import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbackConfirmComponent } from './feedback-confirm.component';

describe('FeedbackConfirmComponent', () => {
  let component: FeedbackConfirmComponent;
  let fixture: ComponentFixture<FeedbackConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FeedbackConfirmComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeedbackConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
