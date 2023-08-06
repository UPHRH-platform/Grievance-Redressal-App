import { TestBed } from '@angular/core/testing';

import { GrievanceServiceService } from './grievance-service.service';

describe('GrievanceServiceService', () => {
  let service: GrievanceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GrievanceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
