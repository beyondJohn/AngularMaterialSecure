import { TestBed, inject } from '@angular/core/testing';

import { GetImageDbService } from './get-image-db.service';

describe('GetImageDbService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GetImageDbService]
    });
  });

  it('should be created', inject([GetImageDbService], (service: GetImageDbService) => {
    expect(service).toBeTruthy();
  }));
});
