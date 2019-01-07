import { TestBed, inject } from '@angular/core/testing';

import { WeatherDecisionService } from './weather-decision.service';

describe('WeatherDecisionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WeatherDecisionService]
    });
  });

  it('should be created', inject([WeatherDecisionService], (service: WeatherDecisionService) => {
    expect(service).toBeTruthy();
  }));
});
