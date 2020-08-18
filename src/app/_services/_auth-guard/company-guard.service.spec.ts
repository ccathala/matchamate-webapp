import { TestBed } from '@angular/core/testing';

import { CompanyGuardService } from './company-guard.service';

describe('CompanyGuardService', () => {
  let service: CompanyGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CompanyGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
