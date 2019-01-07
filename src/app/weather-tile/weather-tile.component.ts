import {Component, Input, OnInit} from '@angular/core';
import {WeatherIconType} from '../enums/weather-icon-type.enum';
import {WeatherTileType} from '../enums/weather-tile-type.enum';
import {Translations} from '../enums/translations.enum';

@Component({
  selector: 'app-weather-tile',
  templateUrl: './weather-tile.component.html',
  styleUrls: ['./weather-tile.component.scss']
})
export class WeatherTileComponent implements OnInit {

  translations = Translations;
  weatherTileType = WeatherTileType;

  @Input() tileType: WeatherTileType;
  @Input() weatherTime: string;
  @Input() weatherIconType: WeatherIconType;

  constructor() { }

  ngOnInit() {
  }

}
