import { TestBed } from '@angular/core/testing';

import { RoleContentGuard } from './role-content.guard';

describe('RoleContentGuard', () => {
  let guard: RoleContentGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(RoleContentGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
