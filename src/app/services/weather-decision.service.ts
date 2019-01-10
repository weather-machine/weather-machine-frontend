import {Injectable} from '@angular/core';
import {WeatherIconType} from '../enums/weather-icon-type.enum';

@Injectable({
  providedIn: 'root'
})
export class WeatherDecisionService {

  private tempThreshold = 4;
  private tempThreshold2 = 10;
  private tempThreshold3 = 18;
  private cloudCoverThreshold = 50;
  private cloudCoverThreshold2 = 60;
  private cloudCoverThreshold3 = 80;
  private humidityThreshold = 90;
  private windSpeedThreshold = 15;

  private weatherMainTypeMap = {
    1: 'Pogodnie',
    2: 'Jasno',
    3: 'Przewaznie pogodnie',
    4: 'Przewaznie jasno',
    5: 'Zamglone slonce',
    6: 'Mgla',
    7: 'Przemijajace chmury',
    8: 'Wiecej slonca niz chmur',
    9: 'Rozproszone chmury',
    10: 'Polowiczne zachmurzenie',
    11: 'Slonce i chmury',
    12: 'Wysokie chmury',
    13: 'Wiecej chmur niz slonca',
    14: 'Polowicznie slonecznie',
    15: 'Rozbite chmury',
    16: 'Przewaznie pochmurno',
    17: 'Chmury',
    18: 'Pochmurno',
    19: 'Niskie chmury',
    20: 'Lekka mgla',
    21: 'Mgla',
    22: 'Gesta mgla',
    23: 'Mgla lodowa',
    24: 'Burza piaskowa',
    25: 'Burza pylu',
    26: 'Zwiekaszajace sie zachmurzenie',
    27: 'Zmniejszajace sie zachmurzenie',
    28: 'Rozpogodzenie',
    29: 'Przeswity slonca',
    30: 'Wczesna mgla, po ktorej nastepuje rozpogodzenie',
    31: 'Popoludniowe zachmurzenie',
    32: 'Poranne zachmurzenie',
    33: 'Upalnie',
    34: 'Niski poziom zamglenia'
  };

  constructor() { }

  isNight(date: Date): boolean {
    return date.getHours() > 20 || date.getHours() < 5;
  }

  isCloudMoon(cloudCover: number): boolean {
    return cloudCover > this.cloudCoverThreshold;
  }

  isMoon(cloudCover: number): boolean {
    return cloudCover <= this.cloudCoverThreshold;
  }

  isCloudLightning(cloudCover: number, humidity: number, temp: number, windSpeed: number): boolean {
    return cloudCover > this.cloudCoverThreshold3 && humidity > this.humidityThreshold
      && temp > this.tempThreshold3 && windSpeed > this.windSpeedThreshold;
  }

  isCloudSunRain(cloudCover: number, humidity: number, temp: number): boolean {
    return cloudCover > this.cloudCoverThreshold && humidity > this.humidityThreshold
      && temp > this.tempThreshold2;
  }

  isCloudSnow(cloudCover: number, humidity: number, temp: number): boolean {
    return cloudCover > this.cloudCoverThreshold2 && humidity > this.humidityThreshold
      && temp < this.tempThreshold;
  }

  isCloudRain(cloudCover: number, humidity: number, temp: number): boolean {
    return cloudCover > this.cloudCoverThreshold2 && humidity > this.humidityThreshold
      && temp >= this.tempThreshold;
  }

  isCloud(cloudCover: number): boolean {
    return cloudCover >= this.cloudCoverThreshold;
  }

  isSun(cloudCover: number): boolean {
    return cloudCover < this.cloudCoverThreshold;
  }

  classifyWeatherIconType(date: Date, cloudCover: number, humidity: number, temp: number,
                          windSpeed: number, isNight: boolean = false): WeatherIconType {
    let weatherIconType = WeatherIconType.CLOUD_SUN;

    if (isNight || this.isNight(date)) {
      if (this.isCloudMoon(cloudCover)) {
        weatherIconType = WeatherIconType.CLOUD_MOON;
      }
      if (this.isMoon(cloudCover)) {
        weatherIconType = WeatherIconType.MOON;
      }
    } else {
      if (this.isCloudLightning(cloudCover, humidity, temp, windSpeed)) {
        weatherIconType = WeatherIconType.CLOUD_LIGHTNING;
      } else if (this.isCloudSunRain(cloudCover, humidity, temp)) {
        weatherIconType = WeatherIconType.CLOUD_SUN_RAIN;
      } else if (this.isCloudSnow(cloudCover, humidity, temp)) {
        weatherIconType = WeatherIconType.CLOUD_SNOW;
      } else if (this.isCloudRain(cloudCover, humidity, temp)) {
        weatherIconType = WeatherIconType.CLOUD_RAIN;
      } else if (this.isCloud(cloudCover)) {
        weatherIconType = WeatherIconType.CLOUD;
      } else if (this.isSun(cloudCover)) {
        weatherIconType = WeatherIconType.SUN;
      }
    }

    return weatherIconType;
  }

  getMainDesc(weatherIconType: WeatherIconType): string {
    let mainDesc = this.weatherMainTypeMap[14];
    if (weatherIconType === WeatherIconType.CLOUD_SUN) {
      mainDesc = this.weatherMainTypeMap[11];
    } else if (weatherIconType === WeatherIconType.CLOUD_MOON) {
      mainDesc = this.weatherMainTypeMap[18];
    } else if (weatherIconType === WeatherIconType.MOON) {
      mainDesc = this.weatherMainTypeMap[18];
    } else if (weatherIconType === WeatherIconType.CLOUD_LIGHTNING) {
      mainDesc = this.weatherMainTypeMap[18];
    } else if (weatherIconType === WeatherIconType.CLOUD_SUN_RAIN) {
      mainDesc = this.weatherMainTypeMap[13];
    } else if (weatherIconType === WeatherIconType.CLOUD_SNOW) {
      mainDesc = this.weatherMainTypeMap[18];
    } else if (weatherIconType === WeatherIconType.CLOUD_RAIN) {
      mainDesc = this.weatherMainTypeMap[18];
    } else if (weatherIconType === WeatherIconType.CLOUD) {
      mainDesc = this.weatherMainTypeMap[17];
    } else if (weatherIconType === WeatherIconType.SUN) {
      mainDesc = this.weatherMainTypeMap[1];
    }

    return mainDesc;
  }
}
