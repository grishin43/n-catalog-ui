import { TestBed } from '@angular/core/testing';

import { ProcessAutosaveService } from './process-autosave.service';

describe('ProcessAutosaveService', () => {
  let service: ProcessAutosaveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcessAutosaveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
