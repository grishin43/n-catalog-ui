import { TestBed } from '@angular/core/testing';

import { BpmnToolbarService } from './bpmn-toolbar.service';

describe('BpmnToolbarService', () => {
  let service: BpmnToolbarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BpmnToolbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
