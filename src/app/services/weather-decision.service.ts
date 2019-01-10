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

  constructor() { }

  isNight(timestampUTC: number): boolean {
    const date = new Date(timestampUTC);
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

  classifyWeatherIconType(timestampUTC: number, cloudCover: number, humidity: number, temp: number, windSpeed: number): WeatherIconType {
    let weatherIconType = WeatherIconType.CLOUD_SUN;

    if (this.isNight(timestampUTC)) {
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
}
