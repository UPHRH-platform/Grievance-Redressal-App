import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceRaiserFormComponent } from './grievance-raiser-form.component';

describe('GrievanceRaiserFormComponent', () => {
  let component: GrievanceRaiserFormComponent;
  let fixture: ComponentFixture<GrievanceRaiserFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceRaiserFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrievanceRaiserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
