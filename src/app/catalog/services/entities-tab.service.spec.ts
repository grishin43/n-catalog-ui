import { TestBed } from '@angular/core/testing';

import { EntitiesTabService } from './entities-tab.service';

describe('EntitiesTabService', () => {
  let service: EntitiesTabService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntitiesTabService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
