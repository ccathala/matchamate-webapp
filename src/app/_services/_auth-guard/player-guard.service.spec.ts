import { TestBed } from '@angular/core/testing';

import { PlayerGuardService } from './player-guard.service';

describe('PlayerGuardService', () => {
  let service: PlayerGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
