import {Component, Input, OnInit} from '@angular/core';
import {WeatherIconType} from '../enums/weather-icon-type.enum';

@Component({
  selector: 'app-weather-tile-icon',
  templateUrl: './weather-tile-icon.component.html',
  styleUrls: ['./weather-tile-icon.component.scss']
})
export class WeatherTileIconComponent implements OnInit {

  weatherIconType = WeatherIconType;

  @Input() iconType: WeatherIconType;

  constructor() { }

  ngOnInit() {
  }

}
