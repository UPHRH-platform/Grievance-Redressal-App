import { TestBed } from '@angular/core/testing';

import { RoleContentService } from './role-content.service';

describe('RoleContentService', () => {
  let service: RoleContentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RoleContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
