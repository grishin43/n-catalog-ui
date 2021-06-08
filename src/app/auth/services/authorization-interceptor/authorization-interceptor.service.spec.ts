import {TestBed} from '@angular/core/testing';

import {AuthorizationInterceptor} from './authorization-interceptor.service';

describe('TokenInterceptorService', () => {
  let service: AuthorizationInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthorizationInterceptor);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
