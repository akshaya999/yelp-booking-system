import { TestBed } from '@angular/core/testing';

import { YelphttpService } from './yelphttp.service';

describe('YelphttpService', () => {
  let service: YelphttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YelphttpService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
