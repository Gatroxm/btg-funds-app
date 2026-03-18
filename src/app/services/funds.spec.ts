import { TestBed } from '@angular/core/testing';

import { Funds } from './funds';

describe('Funds', () => {
  let service: Funds;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Funds);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
