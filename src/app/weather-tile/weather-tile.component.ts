import {Component, Input, OnInit} from '@angular/core';
import {WeatherIconType} from '../weather-icon-type.enum';
import {WeatherTileType} from '../weather-tile-type.enum';
import {Translations} from '../translations.enum';

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
