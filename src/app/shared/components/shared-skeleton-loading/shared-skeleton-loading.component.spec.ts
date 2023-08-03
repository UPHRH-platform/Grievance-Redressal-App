import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedSkeletonLoadingComponent } from './shared-skeleton-loading.component';

describe('SharedSkeletonLoadingComponent', () => {
  let component: SharedSkeletonLoadingComponent;
  let fixture: ComponentFixture<SharedSkeletonLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedSkeletonLoadingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SharedSkeletonLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
