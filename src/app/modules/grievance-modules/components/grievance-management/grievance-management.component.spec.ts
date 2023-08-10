import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceManagementComponent } from './grievance-management.component';

describe('GrievanceManagementComponent', () => {
  let component: GrievanceManagementComponent;
  let fixture: ComponentFixture<GrievanceManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrievanceManagementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GrievanceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
