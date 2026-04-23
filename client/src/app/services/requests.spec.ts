import { TestBed } from '@angular/core/testing';

import { Requests } from './requests';

describe('Requests', () => {
  let service: Requests;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Requests);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
