import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WeatherTileIconComponent } from './weather-tile-icon.component';

describe('WeatherTileIconComponent', () => {
  let component: WeatherTileIconComponent;
  let fixture: ComponentFixture<WeatherTileIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WeatherTileIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WeatherTileIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
