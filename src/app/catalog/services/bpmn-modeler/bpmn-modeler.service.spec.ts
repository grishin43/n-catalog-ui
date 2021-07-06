import { TestBed } from '@angular/core/testing';

import { BpmnModelerService } from './bpmn-modeler.service';

describe('BpmnModelerService', () => {
  let service: BpmnModelerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BpmnModelerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
