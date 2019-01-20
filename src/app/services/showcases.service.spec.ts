import { TestBed, inject } from '@angular/core/testing';

import { ShowcasesService } from './showcases.service';

describe('ShowcasesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShowcasesService]
    });
  });

  it('should be created', inject([ShowcasesService], (service: ShowcasesService) => {
    expect(service).toBeTruthy();
  }));
});
