import { TestBed } from '@angular/core/testing';

import { AuthenticationService } from './authentication';
import { commonTestProviders, commonTestImports } from '../../../../test-helpers';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthenticationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
